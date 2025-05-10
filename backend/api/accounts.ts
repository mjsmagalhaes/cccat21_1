import express, { Request, Response } from "express";
import Debug from "debug";
import { DAODatabaseFactory } from "../DAO/DB";
import { AccountService } from "../application/account";

type ControllerHandler = (req: Request, res: Response) => Promise<any>;

const router = express.Router();

const debug = Debug("account");

const account = new AccountService(new DAODatabaseFactory());

const createController = (fn: ControllerHandler) => {
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

router.get(
    "/:accountId",
    createController(async ({ body, params, query }) => {
        return await account.getAccount.execute(params.accountId);
    })
);

export default router;
