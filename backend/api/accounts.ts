import express, { Request, Response } from "express";
import Debug from "debug";
import { GetAccount } from "../application/GetAccount";
import { DAODatabaseFactory } from "../DAO/DB";

const app = express();
app.use(express.json());
const router = express.Router();

const debug = Debug("account");
const reportError = Debug("error");

const getAccount = new GetAccount(new DAODatabaseFactory());

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
