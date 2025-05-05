// -0
import express, { Request, Response } from "express";
import Debug from "debug";
import { AccountDAODatabase } from "../DAO/DB/AccountDAODatabase";
import { PlaceOrder } from "../application/PlaceOrder";
import { AssetDAODatabase } from "../DAO/DB/AssetDAODatabase";
import { WalletDAODatabase } from "../DAO/DB";
import { OrderDAODatabase } from "../DAO/DB/OrderDAO.Database";

const router = express.Router();

const debug = Debug("place_order");
const reportError = Debug("error");

const placeOrder = new PlaceOrder(new AccountDAODatabase(), new AssetDAODatabase(), new WalletDAODatabase(), new OrderDAODatabase());

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;

    try {
        debug(input);
        const order = await placeOrder.execute(input.accountId, placeOrder.convert(input));
        debug(order);
        res.json(order);
    } catch (error) {
        reportError(error);

        if (error instanceof Error)
            res.status(422).json({ error: error.message });

        return;
    }
});

export default router;