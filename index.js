"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.ServerPlugin = void 0;
const fs = require("fs");
const ServerPluginBase_1 = require("savatora-core/bin/ServerPluginBase");
const Framework_1 = require("./bin/Framework");
__exportStar(require("./bin/Point"), exports);
__exportStar(require("./bin/App"), exports);
__exportStar(require("./bin/Map"), exports);
class ServerPlugin extends ServerPluginBase_1.ServerPluginBase {
    onBegin(sector) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sector.fw)
                sector.fw = {};
            if (!sector.fw.dir)
                sector.fw.dir = "src";
            sector.fw._rootDir = sector.rootDir + "/" + sector.fw.dir;
            this.framework = new Framework_1.Framework();
            const appPath = sector.fw._rootDir + "/app/config/App.js";
            if (!fs.existsSync(appPath))
                return console.log("[WARM] App file not found.");
            const MyApp = require(appPath).App;
            this.framework.app = MyApp;
        });
    }
    onListen(req, res, sector) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.framework.onListen(req, res, sector.fw);
        });
    }
}
exports.ServerPlugin = ServerPlugin;
