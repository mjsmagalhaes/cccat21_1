import express, { Request, Response } from "express";
import Debug from "debug";
import { DAODatabaseFactory } from "../DAO/DB";
import { AccountService } from "../application/account";

const router = express.Router();

const debug = Debug("account");

const account = new AccountService(new DAODatabaseFactory());

router.get("/:accountId", async (req: Request, res: Response) => {
    const accountId = req.params.accountId;
    try {
        debug(accountId);
        const output = await account.getAccount.execute(accountId);
        debug(output);

        res.json(output);
    } catch (error) {}
});

export default router;
