import express, { Request, Response } from "express";
import Debug from "debug";
import { PlaceOrder } from "../application/PlaceOrder";
import { DAODatabaseFactory } from "../DAO/DB";

const router = express.Router();

const debug = Debug("place_order");
const reportError = Debug("error");

const placeOrder = new PlaceOrder(new DAODatabaseFactory());

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;

    try {
        debug("api", input);
        const order = await placeOrder.execute(
            input.accountId,
            placeOrder.convert(input)
        );
        debug("api", order);
        res.json(order);
    } catch (error) {
        reportError(error);

        if (error instanceof Error)
            res.status(422).json({ error: error.message });

        return;
    }
});

export default router;
