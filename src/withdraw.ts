import express, { Request, Response } from "express";
import Debug from "debug";
import { Database } from "./services/db";
import { errorResponse } from "./services/error";

const app = express();
app.use(express.json());
const router = express.Router();

const debug = Debug("withdraw");
Debug.enable("withdraw, error");

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;
    const db = new Database();
    const quantity = parseFloat(input.quantity);

    const account = await db.getAccount(input.accountId);
    if (account == null) return errorResponse(res, "ACCOUNT_NOT_FOUND");

    const asset = await db.getAsset(input.assetId);
    if (asset == null) return errorResponse(res, "ASSET_NOT_FOUND");

    if (!input.quantity || isNaN(quantity) || quantity < 0) return errorResponse(res, "BAD_WITHDRAW_REQUEST");

    const wallet = await db.getWallet(account, asset);
    if (wallet.quantity < quantity) return errorResponse(res, "INSUFFICIENT_FUNDS");

    debug(`Wallet ${account.account_id}:${asset.asset_id} found. Updating ...`);
    await db.updateWallet(
        account.account_id,
        asset.asset_id,
        wallet.quantity - quantity
    );

    const new_wallet = await db.getWallet(account, asset);
    res.json({
        status: "ok",
        quantity: new_wallet.quantity,
        asset_id: new_wallet.asset_id,
    });
});

app.use("/withdraw", router);
app.listen(3000);
