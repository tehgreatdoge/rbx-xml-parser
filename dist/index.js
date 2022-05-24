"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RobloxXMLParser = exports.Instance = void 0;
const parser_1 = require("./parser");
const classes_1 = require("./classes");
Object.defineProperty(exports, "Instance", { enumerable: true, get: function () { return classes_1.Instance; } });
const xml2js_1 = require("xml2js");
class RobloxXMLParser {
    constructor() {
        this.dataModel = new classes_1.Instance("DataModel");
        this.dataModel.properties = {};
    }
    async parse(xmlContent) {
        const parsed = await (0, xml2js_1.parseStringPromise)(xmlContent);
        for (let i in parsed.roblox.Item) {
            (0, parser_1.parseInstance)(parsed.roblox.Item[i]).setParent(this.dataModel);
        }
    }
    convertToXML() {
        const builder = new xml2js_1.Builder();
        let base = { roblox: { ["$"]: { version: "4" }, Item: [] } };
        this.dataModel.children.forEach(element => {
            base.roblox.Item.push((0, parser_1.convertInstance)(element));
        });
        return builder.buildObject(base).replaceAll("&#xD;", "").replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n', "");
    }
}
exports.RobloxXMLParser = RobloxXMLParser;
