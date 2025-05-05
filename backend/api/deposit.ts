import express, { Request, Response } from "express";
import Debug from "debug";
import { Deposit } from "../application/Deposit";
import {
    AccountDAODatabase,
    AssetDAODatabase,
    WalletDAODatabase,
} from "../DAO/DB";

const router = express.Router();
const debug = Debug("deposit");
const reportError = Debug("error");

const deposit = new Deposit(
    new AccountDAODatabase(),
    new AssetDAODatabase(),
    new WalletDAODatabase()
);

router.post("/", async (req: Request, res: Response) => {
    const input = req.body ?? {};
    const quantity = parseFloat(input.quantity);

    try {
        debug(input);
        const wallet = await deposit.execute(
            input.accountId,
            input.assetId,
            quantity
        );

        debug(wallet);

        res.json({
            status: "ok",
            quantity: wallet.quantity,
            asset_id: wallet.asset_id,
        });
    } catch (error) {
        reportError(error);

        if (error instanceof Error)
            res.status(422).json({ error: error.message });
    }
});

export default router;
