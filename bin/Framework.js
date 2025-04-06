"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Framework = void 0;
const fs = require("fs");
const ejs = require("ejs");
const Routing_1 = require("./Routing");
class Framework {
    onListen(req, res, fw) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = Routing_1.Routing.search(req.method, req.url, this.app.maps);
            if (!route)
                return;
            const point = new route.point();
            point.req = req;
            point.res = res;
            point.route = route;
            try {
                yield point.onBefore();
                if (route.argsArray) {
                    yield point.onListen(...route.argsArray);
                }
                else {
                    yield point.onListen();
                }
                yield point.onAfter();
                if (point.autoRender) {
                    const renderFullPath = fw._rootDir + "/rendering/point/" + point.constructor.name + ".html";
                    let renderContent = fs.readFileSync(renderFullPath).toString();
                    // ejs rendering
                    renderContent = ejs.render(renderContent, point._sendData);
                    res.write(renderContent);
                    res.end();
                }
            }
            catch (error) {
                res.statusCode = 500;
                if (fw.displayError) {
                    res.write(error.stack.toString());
                    res.end();
                }
                else {
                    res.end();
                }
            }
        });
    }
}
exports.Framework = Framework;
