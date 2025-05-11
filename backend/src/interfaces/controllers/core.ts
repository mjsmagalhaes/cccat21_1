import { Request, Response } from "express";
import Debug from "debug"

const reportError = Debug("error:controller");

type ControllerHandler = (req: Request, res: Response) => Promise<any>;

export const createController = (fn: ControllerHandler, debug: Debug.Debugger = Debug("controller")) => {
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