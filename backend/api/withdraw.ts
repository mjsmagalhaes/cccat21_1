import express, { Request, Response } from "express";
import Debug from "debug";
import { Withdraw } from "../application/Withdraw";
import { DAODatabaseFactory } from "../DAO/DB";

const router = express.Router();
const debug = Debug("withdraw");
const reportError = Debug("error");

const withdraw = new Withdraw(new DAODatabaseFactory());

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;
    const quantity = parseFloat(input.quantity);

    try {
        debug(input);
        const account = await withdraw.execute(
            input.accountId,
            input.assetId,
            quantity
        );
        debug(account);
        res.json(account);
    } catch (error) {
        reportError(error);

        if (error instanceof Error)
            res.status(422).json({ error: error.message });

        return;
    }
});

export default router;
