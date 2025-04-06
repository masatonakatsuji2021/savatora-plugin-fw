import * as fs from "fs";
import * as ejs from "ejs";
import { ThreadServerRequest } from "savatora-core/bin/ThreadServerRequest";
import { ThreadServerResponse } from "savatora-core/bin/ThreadServerResponse";
import { Routing } from "./Routing";
import { App } from "./App";
import { FrameworkOption } from "./FrameworkOption";

export class Framework {

    public app: typeof App;

    public async onListen(req : ThreadServerRequest, res: ThreadServerResponse, fw:FrameworkOption) {

        const route = Routing.search(req.method, req.url, this.app.maps);
        if (!route) return;

        const point = new route.point();
        point.req = req;
        point.res = res;
        point.route = route;
        try {

            await point.onBefore();

            if (route.argsArray) {
                await point.onListen(...route.argsArray);
            }
            else {
                await point.onListen();
            }

            await point.onAfter();

            if (point.autoRender) {
                const renderFullPath =  fw._rootDir + "/rendering/point/" + point.constructor.name + ".html";
                let renderContent = fs.readFileSync(renderFullPath).toString();

                // ejs rendering
                renderContent = ejs.render(renderContent, point._sendData);

                res.write(renderContent);
                res.end();
            }
            
        } catch (error) {
            res.statusCode = 500;
            if (fw.displayError) {
                res.write(error.stack.toString());
                res.end();    
            }
            else {
                res.end();
            }
        }
    }

}
