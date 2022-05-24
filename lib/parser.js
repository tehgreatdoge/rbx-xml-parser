"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertInstance = exports.parseInstance = exports.parseProperties = exports.convertProperties = void 0;
var classes_1 = require("./classes");
function convertProperties(properties) {
    var grouped = {};
    for (var name in properties) {
        var _a = properties[name], value = _a.value, type = _a.type;
        if (!grouped[type]) {
            // create category if list doesn't exists
            grouped[type] = [];
        }
        var property = { "$": { name: name } };
        if (typeof value == "object") {
            property = Object.assign({}, property, value); // merge
            grouped[type].push(property);
        }
        else if (value) {
            // set value on xml
            property._ = value.toString();
            grouped[type].push(property);
        }
    }
    return grouped;
}
exports.convertProperties = convertProperties;
function parseProperties(properties) {
    var parsed = {};
    for (var type in properties) {
        var props = properties[type];
        for (var i in props) {
            var property = props[i];
            var name = property["$"].name;
            var value = property._;
            if (!value && Object.keys(property).length > 1) {
                value = {};
                var values = property;
                delete values["$"];
                for (var key in values) {
                    var val = values[key][0];
                    if (val) {
                        value[key] = val;
                    }
                }
            }
            parsed[name] = { value: value, type: type };
        }
    }
    return parsed;
}
exports.parseProperties = parseProperties;
// parse and convert instance back to xml functions:
/* Used to parse properties into an easier structure */
function parseInstance(instance) {
    var _a = instance["$"], className = _a.class, referent = _a.referent;
    var result = new classes_1.Instance(className);
    result.properties = parseProperties(instance.Properties[0]);
    result.referent = referent;
    if (instance.Item) {
        for (var i in instance.Item) {
            parseInstance(instance.Item[i]).setParent(result);
        }
    }
    return result;
}
exports.parseInstance = parseInstance;
function convertInstance(instance) {
    var _a;
    var converted = (_a = {}, _a["$"] = { "class": instance.class, "referent": instance.referent }, _a.Properties = [convertProperties(instance.properties)], _a.Item = [], _a);
    instance.children.forEach(function (element) {
        converted.Item.push(convertInstance(element));
    });
    return converted;
}
exports.convertInstance = convertInstance;
