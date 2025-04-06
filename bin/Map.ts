import { Point } from "./Point";

export interface Maps {
    [name: string] : Maps | MapClass,
}

export interface MapOption {

    url: string,

    method? : Method | string | Array<Method> | Array<string>,

    point: typeof Point,
}

export class MapClass {

    public identifier: number;

    public url: string;

    public method: Method | string | Array<Method> | Array<string>;

    public point: typeof Point;

    public constructor(option: MapOption) {
        this.identifier = Math.round(Math.random() * 10000000);
        this.url = option.url;
        this.point = option.point;
        if (option.method) {
            if (typeof option.method == "string") option.method = [ option.method ];
            this.method = option.method;
        }
    }
}

export const Map = (option: MapOption) => {
    return new MapClass(option);
};

export enum Method {

    GET = "GET",

    POST = "POST",

    PUT = "PUT",

    DELETE = "DELETE",
}