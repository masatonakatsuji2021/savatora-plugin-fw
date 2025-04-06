"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor() {
        this.autoRender = false;
        this._sendData = {};
    }
    sendData(data) {
        const c = Object.keys(data);
        for (let n = 0; n < c.length; n++) {
            const name = c[n];
            const value = data[name];
            this._sendData[name] = value;
        }
    }
    move(map, args) {
        this.res.statusCode = 301;
        let url = map.url;
        if (args) {
            const c = Object.keys(args);
            for (let n = 0; n < c.length; n++) {
                const name = c[n];
                const value = args[name];
                url = url.split("{" + name + "}").join(value.toString());
            }
        }
        this.res.setHeader("location", url);
        this.res.end();
        return this;
    }
    /**
     * ***onBefore***
     */
    onBefore() { }
    /**
     * ***onListen***
     * @param {...any} argv
     */
    onListen(...argv) { }
    /**
     * ***onAfter***
     */
    onAfter() { }
}
exports.Point = Point;
