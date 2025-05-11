import express from "express";
import Debug from "debug";
import { DatabaseRepositoryFactory } from "../../DAO/DB";
import { AccountService } from "../../application/account";
import { createController } from "./core";

const router = express.Router();
const account = new AccountService(new DatabaseRepositoryFactory());

router.get(
    "/:accountId",
    createController(async ({ body, params, query }) => {
        return await account.getAccount.execute(params.accountId);
    }, Debug("controller:account"))
);

export default router;
