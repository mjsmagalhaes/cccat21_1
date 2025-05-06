import { GetDepth } from "./../application/GetDepth";
import express, { Request, Response } from "express";
import Debug from "debug";
import { DAODatabaseFactory } from "../DAO/DB";

const router = express.Router();
const debug = Debug("markets");
const reportError = Debug("error");

const getDepth = new GetDepth(new DAODatabaseFactory());

router.post("/:marketId/info", async (req: Request, res: Response) => {});

router.post("/:marketId/trades", async (req: Request, res: Response) => {});

router.post("/:marketId/depth", async (req: Request, res: Response) => {
    const marketId = req.params.marketId;
    try {
        debug(marketId);
        const output = await getDepth.execute(marketId);
        debug(output);

        res.json(output);
    } catch (error) {
        reportError(error);
    }
});

export default router;
