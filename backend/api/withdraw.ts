import express, { Request, Response } from "express";
import Debug from "debug";
import { DAODatabaseFactory } from "../DAO/DB";
import { AccountService } from "../application/account";

const router = express.Router();
const debug = Debug("withdraw");
const reportError = Debug("error");

// const withdraw = new Withdraw(new DAODatabaseFactory());
const account = new AccountService(new DAODatabaseFactory());

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;
    const quantity = parseFloat(input.quantity);

    try {
        debug(input);
        const accountOutput = await account.withdraw.execute(
            input.accountId,
            input.assetId,
            quantity
        );
        debug(accountOutput);
        res.json(accountOutput);
    } catch (error) {
        reportError(error);

        if (error instanceof Error)
            res.status(422).json({ error: error.message });

        return;
    }
});

export default router;
