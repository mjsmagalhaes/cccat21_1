import Debug from "debug";
import express from "express";

import {
    DatabaseRepositoryFactory
} from "../../DAO/DB";
import { Deposit } from "../../application/account/Deposit";
import { createController } from "./core";

const router = express.Router();
const deposit = new Deposit(new DatabaseRepositoryFactory());

router.post("/", createController(async ({ body: input }) => {
    const wallet = await deposit.execute(
        input.accountId,
        input.assetId,
        input.quantity
    );

    return {
        status: "ok",
        quantity: wallet.quantity,
        asset_id: wallet.asset_id,
    }
}, Debug("controller:deposit")))

export default router;
