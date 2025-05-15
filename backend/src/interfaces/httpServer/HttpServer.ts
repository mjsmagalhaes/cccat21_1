import express, { Express, Request, Response } from "express";
// import cors from "cors";
import Debug from "debug";
import { ConfigService } from "../../service/ConfigService";

export interface HttpServer {
    route(
        method: string,
        url: string,
        callback: ControllerHandler,
        debug?: Debug.Debugger
    ): void;
    listen(port?: number): void;
}

const reportError = Debug("error:controller");

type ControllerHandler = (req: Request, res: Response) => Promise<any>;

const createController = (
    fn: ControllerHandler,
    debug: Debug.Debugger = Debug("controller")
) => {
    return async (req: Request, res: Response) => {
        try {
            debug(req.body, req.params, req.query);
            const output = await fn(req, res);
            debug(output);

            res.json(output);
        } catch (error) {
            reportError(error);

            if (error instanceof Error)
                res.status(422).json({ error: error.message });

            return;
        }
    };
};

export class ExpressServer implements HttpServer {
    private readonly app: Express;

    constructor() {
        this.app = express();
        this.app.use(express.json());
        // this.app.use(cors());
    }

    route(
        method: "get" | "post" | "put" | "delete",
        url: string,
        callback: ControllerHandler,
        debug: Debug.Debugger = Debug("controller")
    ): void {
        this.app[method](url, createController(callback, debug));
    }

    listen(port?: number): void {
        this.app.listen(port ?? ConfigService.getHttpPort());
    }
}
