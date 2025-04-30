import express, { Request, Response } from "express";
import Debug from "debug";
import { GetAccount } from "../application/GetAccount";
import { AccountDAODatabase } from "../DAO/DB/AccountDAODatabase";

const app = express();
app.use(express.json());
const router = express.Router();

const debug = Debug("account");
const reportError = Debug("error");

const getAccount = new GetAccount(new AccountDAODatabase());

router.get("/:accountId", async (req: Request, res: Response) => {
    const accountId = req.params.accountId;
    try {
        debug(accountId);
        const output = await getAccount.execute(accountId);
        debug(output);

        res.json(output);
    } catch (error) {}
});

export default router;
