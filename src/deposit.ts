import express, { Request, Response } from "express";
import Debug from "debug";
import { Database } from "./services/db";
import { errorResponse } from "./services/error";

const app = express();
app.use(express.json());
const router = express.Router();

const debug = Debug("deposit");
Debug.enable("deposit, error");

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;
    const db = new Database();
    const quantity = parseFloat(input.quantity);

    const account = await db.getAccount(input.accountId);
    if (account == null)
        return errorResponse(res, "ACCOUNT_NOT_FOUND");

    const asset = await db.getAsset(input.assetId);
    if (asset == null) return errorResponse(res, "ASSET_NOT_FOUND");

    if (!input.quantity || isNaN(quantity) || quantity < 0) {
        return res.status(422).json({
            error: "Wrong quantity.",
        });
    }

    const new_wallet = await db.createOrUpdateWallet(account, asset, quantity);

    res.json({
        status: "ok",
        quantity: new_wallet.quantity,
        asset_id: new_wallet.asset_id,
    });
});

app.use('/deposit', router);
app.listen(3000);
