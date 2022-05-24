"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertInstance = exports.parseInstance = exports.parseProperties = exports.convertProperties = void 0;
const classes_1 = require("./classes");
function convertProperties(properties) {
    let grouped = {};
    for (let name in properties) {
        const { value, type } = properties[name];
        if (!grouped[type]) {
            // create category if list doesn't exists
            grouped[type] = [];
        }
        let property = { "$": { name: name } };
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
    let parsed = {};
    for (let type in properties) {
        const props = properties[type];
        for (let i in props) {
            const property = props[i];
            const name = property["$"].name;
            let value = property._;
            if (!value && Object.keys(property).length > 1) {
                value = {};
                let values = property;
                delete values["$"];
                for (let key in values) {
                    const val = values[key][0];
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
    const { class: className, referent } = instance["$"];
    const result = new classes_1.Instance(className);
    result.properties = parseProperties(instance.Properties[0]);
    result.referent = referent;
    if (instance.Item) {
        for (let i in instance.Item) {
            parseInstance(instance.Item[i]).setParent(result);
        }
    }
    return result;
}
exports.parseInstance = parseInstance;
function convertInstance(instance) {
    let converted = { ["$"]: { "class": instance.class, "referent": instance.referent }, Properties: [convertProperties(instance.properties)], Item: [] };
    instance.children.forEach(element => {
        converted.Item.push(convertInstance(element));
    });
    return converted;
}
exports.convertInstance = convertInstance;
