import Debug from "debug";
import express, { Request, Response } from "express";
import { DatabaseRepositoryFactory } from "../../DAO/DB";
import { OrderService } from "../../application/order";
import { createController } from "./core";

const router = express.Router();
const debug = Debug("controller:markets");


const orderService = new OrderService(new DatabaseRepositoryFactory());

router.post("/:marketId/info", createController(async (req: Request, res: Response) => { }, debug));

router.post("/:marketId/trades", createController(async (req: Request, res: Response) => { }), debug);

router.post("/:marketId/depth", createController(async ({ params }) => {
    return await orderService.getDepth.execute(params.marketId);
}, debug));

export default router;
