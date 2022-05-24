"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instance = void 0;
var crypto = require("crypto");
var Instance = /** @class */ (function () {
    function Instance(className, parent) {
        this.children = [];
        this.referent = "RBX" + crypto.randomBytes(16).toString('hex').toUpperCase();
        this.class = className || "Part";
        this.properties = { Name: { value: className, type: "string" } };
        if (parent) {
            this.setParent(parent);
        }
    }
    Instance.prototype.setParent = function (newParent) {
        var _this = this;
        var oldparent = this.parent;
        if (oldparent) {
            oldparent.children = oldparent.children.filter(function (x) { return x.referent != _this.referent; });
        }
        this.parent = newParent;
        newParent.children.push(this);
    };
    Instance.prototype.Clone = function () {
        var clone = new Instance(this.class);
        clone.properties = this.properties;
        this.children.forEach(function (element) {
            element.Clone().setParent(clone);
        });
        return clone;
    };
    Instance.prototype.getDescendants = function () {
        var descendants = [];
        this.children.forEach(function (element) {
            descendants.push(element);
            element.getDescendants().forEach(function (element) {
                descendants.push(element);
            });
        });
        return descendants;
    };
    return Instance;
}());
exports.Instance = Instance;
