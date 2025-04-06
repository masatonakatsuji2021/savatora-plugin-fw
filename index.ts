import * as fs from "fs";
import { ServerPluginBase } from "savatora-core/bin/ServerPluginBase";
import { ThreadServerRequest } from "savatora-core/bin/ThreadServerRequest";
import { ThreadServerResponse } from "savatora-core/bin/ThreadServerResponse";
import { ServerSector } from "savatora-core/bin/ServerSector";
import { Framework } from "./bin/Framework";
import { FrameworkOption } from "./bin/FrameworkOption";
import { App } from "./bin/App";

export * from "./bin/Point";
export * from "./bin/App";
export * from "./bin/Map";

export interface ServerSectorFramework extends ServerSector {
    fw: FrameworkOption,
}

export class ServerPlugin extends ServerPluginBase {
    
    private framework : Framework;

    public async onBegin(sector: ServerSectorFramework): Promise<void> {
        if (!sector.fw) sector.fw = {};
        if (!sector.fw.dir) sector.fw.dir = "src";
        sector.fw._rootDir = sector.rootDir + "/" + sector.fw.dir;
        this.framework = new Framework();

        const appPath = sector.fw._rootDir + "/app/config/App.js";
        if (!fs.existsSync(appPath)) return console.log("[WARM] App file not found.");
        const MyApp = require(appPath).App as typeof App;
        this.framework.app = MyApp;
    }

    public async onListen(req: ThreadServerRequest, res: ThreadServerResponse, sector: ServerSectorFramework) {
        await this.framework.onListen(req, res, sector.fw);
    }
}