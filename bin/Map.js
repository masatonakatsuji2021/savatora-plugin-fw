"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = exports.Map = exports.MapClass = void 0;
class MapClass {
    constructor(option) {
        this.identifier = Math.round(Math.random() * 10000000);
        this.url = option.url;
        this.point = option.point;
        if (option.method) {
            if (typeof option.method == "string")
                option.method = [option.method];
            this.method = option.method;
        }
    }
}
exports.MapClass = MapClass;
const Map = (option) => {
    return new MapClass(option);
};
exports.Map = Map;
var Method;
(function (Method) {
    Method["GET"] = "GET";
    Method["POST"] = "POST";
    Method["PUT"] = "PUT";
    Method["DELETE"] = "DELETE";
})(Method || (exports.Method = Method = {}));
