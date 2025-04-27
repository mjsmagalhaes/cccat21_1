import express, { Request, Response } from "express";
import Debug from "debug";
import { errorResponse } from "./services/error";
import { Database } from "./services/db";

const app = express();
app.use(express.json());
const router = express.Router();

const debug = Debug("place_order");
Debug.enable("place_order, error");

router.post('/', async (req: Request, res: Response) => {
    const input = req.body;
    const db = new Database();

    const account = await db.getAccount(input.accountId);
    if (!account) return errorResponse(res, "ACCOUNT_NOT_FOUND");

    const [assetId, paymentAssetId] = (input.marketId ?? '/').split('/');
    debug('Market ID:', assetId, paymentAssetId);

    const paymentAsset = await db.getAsset(paymentAssetId);
    if (!paymentAsset) return errorResponse(res, "ASSET_NOT_FOUND");

    const asset = await db.getAsset(assetId);
    if (!asset) return errorResponse(res, "ASSET_NOT_FOUND");

    const paymentAssetWallet = await db.getWallet(account, paymentAsset);
    const assetWallet = await db.getWallet(account, asset);

    debug('paymentAsset:', paymentAssetWallet.quantity, paymentAsset.ticker)
    debug('asset:', assetWallet.quantity, asset.ticker)

    const quantity = parseFloat(input.quantity);
    const price = parseFloat(input.price);
    const side = (input.side ?? '').toLowerCase();

    debug(`${side}: Total = ${price} * ${quantity} = ${price * quantity}`)

    if (isNaN(quantity) || isNaN(price))
        return errorResponse(res, "BAD_ORDER_REQUEST");

    if (!['buy', 'sell'].includes(side))
        return errorResponse(res, "BAD_ORDER_REQUEST");

    if (side == 'buy' && paymentAssetWallet.quantity < quantity * price)
        return errorResponse(res, "INSUFFICIENT_FUNDS");

    if (side == 'sell' && assetWallet.quantity < quantity)
        return errorResponse(res, "INSUFFICIENT_FUNDS");

    db.createOrder(account, asset, paymentAsset, side, quantity, price);

    return res.json({});
});

app.use("/place_order", router);
app.listen(3000);