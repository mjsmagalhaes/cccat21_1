import express, { Request, Response } from "express";
import Debug from "debug";
import { DAODatabaseFactory } from "../DAO/DB";
import { OrderService } from "../application/order";

const router = express.Router();

const debug = Debug("place_order");
const reportError = Debug("error");

const order = new OrderService(new DAODatabaseFactory());

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;

    try {
        debug("api", input);
        const orderData = await order.placeOrder.execute(
            input.accountId,
            order.placeOrder.convert(input)
        );
        debug("api", orderData);
        res.json(orderData);
    } catch (error) {
        reportError(error);

        if (error instanceof Error)
            res.status(422).json({ error: error.message });

        return;
    }
});

export default router;
