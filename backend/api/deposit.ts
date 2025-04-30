import { GetAccount } from "./../application/GetAccount";
import express, { Request, Response } from "express";
import Debug from "debug";
import { Deposit } from "../application/Deposit";
import { AccountDAODatabase } from "../DAO/DB/AccountDAODatabase";
import { ERROR_MESSAGE, ErrorService } from "../service/ErrorService";
import { AssetDAODatabase } from "../DAO/DB/AssetDAODatabase";
import { WalletDAODatabase } from "../DAO/DB/WalletDAODatabase";

const app = express();
app.use(express.json());
const router = express.Router();

const debug = Debug("deposit");
const deposit = new Deposit(
    new AccountDAODatabase(),
    new AssetDAODatabase(),
    new WalletDAODatabase()
);
const getAccount = new GetAccount(new AccountDAODatabase());

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;
    const quantity = parseFloat(input.quantity);

    if (!input.quantity || isNaN(quantity)) {
        return ErrorService.errorResponse(
            res,
            ERROR_MESSAGE.BAD_DEPOSIT_REQUEST
        );
    }

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
        if (error instanceof Error)
            ErrorService.errorResponse(res, error.message);
    }
});

export default router;
