import express, { Request, Response } from "express";
import Debug from "debug";
import { DAODatabaseFactory } from "../DAO/DB";
import { AccountService } from "../application/account";

const router = express.Router();
const account = new AccountService(new DAODatabaseFactory());

const debug = Debug("signup");
const reportError = Debug("error");

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;

    try {
        debug(input);
        const accountOutput = await account.signup.execute(input);
        debug(accountOutput);
        res.json(accountOutput);
    } catch (error) {
        reportError(error);

        if (error instanceof Error)
            res.status(422).json({ error: error.message });

        return;
    }
});

export default router;
