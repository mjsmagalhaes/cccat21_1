import express, { Request, Response } from "express";
import Debug from "debug";
import { DatabaseRepositoryFactory } from "../../DAO/DB";
import { AccountService } from "../../application/account";

const router = express.Router();

const account = new AccountService(new DatabaseRepositoryFactory());
router.post("/", async ({ body: input }) => {
    return await account.withdraw.execute(
        input.accountId,
        input.assetId,
        input.quantity
    );

}, Debug("controller:withdraw"))

export default router;
