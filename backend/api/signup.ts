import express, { Request, Response } from "express";
import Debug from "debug";
import { Signup } from "../application/Signup";
import { AccountDAODatabase } from "../DAO/DB/AccountDAODatabase";
import { Account } from "../entity/Account";
import { ErrorService } from "../service/ErrorService";

const app = express();
app.use(express.json());
const router = express.Router();
const signup = new Signup(new AccountDAODatabase());

const debug = Debug("signup");
const reportError = Debug("error");

router.post("/", async (req: Request, res: Response) => {
    const input = req.body as Account;

    try {
        debug(input);
        const account = await signup.execute(input);
        debug(account);
        res.json(account);
    } catch (error) {
        reportError(error);

        if (error instanceof Error)
            ErrorService.errorResponse(res, error.message);

        return;
    }
});

export default router;
