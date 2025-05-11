import express, { Request, Response } from "express";
import Debug from "debug";
import { DatabaseRepositoryFactory } from "../../DAO/DB";
import { OrderService } from "../../application/order";
import { createController } from "./core";


const router = express.Router();

const debug = Debug("controller:place_order");

const order = new OrderService(new DatabaseRepositoryFactory());

router.post("/", createController(async ({ body: input }) => {
    return await order.placeOrder.execute(
        input.accountId,
        order.placeOrder.convert(input)
    );
}, debug));

export default router;
