import { ThreadServerRequest } from "savatora-core/bin/ThreadServerRequest";
import { ThreadServerResponse } from "savatora-core/bin/ThreadServerResponse";
import { Route } from "./Routing";
import { MapClass } from "./Map";

export class Point {

    public req: ThreadServerRequest;

    public res: ThreadServerResponse;

    public route: Route;

    public autoRender : boolean = false;

    public _sendData = {};

    public sendData(data : {[name: string] : any}) {
        const c = Object.keys(data);
        for(let n = 0 ; n < c.length ; n++){
            const name = c[n];
            const value = data[name];
            this._sendData[name] = value;
        }
    }

    public move(map : MapClass) : this;

    public move(map : MapClass, args? : {[name: string] : string | number}) : this;

    public move(map : MapClass, args? : {[name: string] : string | number}) : this {
        this.res.statusCode = 301;
        let url = map.url;
        if (args) {
            const c = Object.keys(args);
            for (let n = 0 ; n < c.length ; n++) {
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
    public onBefore(){}

    /**
     * ***onListen***
     * @param {...any} argv 
     */
    public onListen(...argv){}

    /**
     * ***onAfter***
     */
    public onAfter() {}
}
