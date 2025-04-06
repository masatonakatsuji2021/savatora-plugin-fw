import { Point } from "./Point";
import { Maps, Method, MapClass } from "./Map";

export enum RouteStatus {

    Success,

    Failed,
}

export interface Route {

    identifier: number,

    status: RouteStatus,

    point: typeof Point,

    url: string,

    method: Method,

    args: {[name: string] : string},

    argsArray: Array<string>,

    query: {[name: string] : string},
}

export class Routing {

    public static search(method: string, targetUrl: string, maps: Maps) : Route {
        let res : Route;
        const c = Object.keys(maps);
        let matrix1 = {};
        let matrix2 = {};
        let aregmentsArray = {};
        let aregments = {};
        for(let n = 0 ; n < c.length ; n++) {
            const name = c[n];
            const mapData = maps[name];
            matrix1[name] = [];
            matrix2[name] = [];

            if (mapData instanceof MapClass) {
                const mapClass = mapData as MapClass;

                const check1 = targetUrl.split("/").slice(1);
                const check2 = mapClass.url.split("/").slice(1);

                for(let n2 = 0 ; n2 < check1.length ; n2++) {
                    const c1 = check1[n2];
                    const c2 = check2[n2];

                    let status : boolean = false;
                    if (c1 === c2) {
                        status = true;
                    }
                    else {
                        if (c2 !== undefined) {
                            if (c2.indexOf("{") === 0 && c2.indexOf("}") === (c2.length - 1)) {
                                if (c1 !== undefined) status = true;
                            }
                            if (c2.indexOf("{?") === 0 && c2.indexOf("}") === (c2.length - 1)) {
                                status = true;
                            }
                        }
                    }
                    matrix1[name].push(status);
                }

                for(let n2 = 0 ; n2 < check2.length ; n2++) {
                    const c1 = check1[n2];
                    const c2 = check2[n2];

                    let argName : string;
                    let status : boolean = false;
                    if (c1 === c2) {
                        status = true;
                    }
                    else {
                        if (c2.indexOf("{") === 0 && c2.indexOf("}") === (c2.length - 1)) {
                            if (c1 !== undefined) {
                                argName = c2.substring(1, c2.length -1);
                                status = true;
                            }
                        }
                        if (c2.indexOf("{?") === 0 && c2.indexOf("}") === (c2.length - 1)) {
                            argName = c2.substring(2, c2.length -1);
                            status = true;
                        }
                    }
                    matrix2[name].push(status);

                    if (argName) {
                        if (!aregments[name]) aregments[name] = {};
                        if (!aregmentsArray[name]) aregmentsArray[name] = [];
                        aregments[name][argName] = c1;
                        if (c1) aregmentsArray[name].push(c1);
                    }
                }            
                
                
            }
            else {
                const subres = this.search(method, targetUrl, mapData as Maps);
                if (subres) res = subres;
            }

        }

        const m1 = Object.keys(matrix1);
        for(let n2 = 0 ; n2 < m1.length ; n2++) {
            const name = m1[n2];
            let juge1 : boolean = false;
            let juge2 : boolean = false;
            if (matrix1[name].indexOf(false) === -1) juge1 = true;
            if (matrix2[name].indexOf(false) === -1) juge2 = true;

            if (juge1 && juge2) {
                const mapClass = maps[name] as MapClass;
                if (mapClass.method) {
                    // @ts-ignore
                    if (mapClass.method.indexOf(method) == -1) {
                        continue;
                    }
                }

                res = {
                    identifier: mapClass.identifier,
                    status: RouteStatus.Success,
                    url: targetUrl,
                    point: mapClass.point,
                    // @ts-ignore
                    method,
                    args: aregments[name],
                    argsArray: aregmentsArray[name],
                };
            }
        }
        return res;
    }
}