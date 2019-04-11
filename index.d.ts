// Typings component for module: kirbe
// Typings created by auguwu <augu@voided.pw> (https://github.com/auguwu)
import http from 'http';

declare namespace Kirbe
{
    export function Static(baseDir: string, indexFile?: string): void;
    export class Server {
        constructor();
        
        public stack: Collection<Kirbe.Middleware>;
        public internalServer: http.Server;
        public externalServer: (req: Kirbe.Request, res: Kirbe.Response) => void;
        public routes: Kirbe.Route[];
        public extensions: any[];
        public use(middleware: any): void;
        public route(a: string, b: (req: Kirbe.Request, res: Kirbe.Response) => void, c?: any): void;
        public listen(a: number | string, b: () => void, c?: any): void;
    }
    export class Response {
        constructor(res: any);
        
        public coreRes: any;
        public headers: { [x: string]: string }
        public statusCode: number;
        public statusMessage: string | null;
        public data: Buffer;
        public body(b: any): this;
        public header(a: string | object, b?: string): this;
        public status(code: number, message?: string): this;
        public end(data?: any): this;
    }
    export class Request {
        constructor(req: any, body: any);
        
        public url: string;
        public req: any;
        public body: Buffer;
        public from: string;
    }
    export class Collection<T> {
        public filter(cb: (i: T) => boolean): T[];
        public map(cb: (i: T) => any): T[];
    }
    export type Route = {
        target: {
            path: string | null;
            method: string | null;
        }
        handler?: any;
    }
    export type Middleware = {
        name: number;
        args?: any[];
        function?: Function;
        constructor?: any;
    }
}

declare module "kirbe"
{
    export = Kirbe;
}
