import express, { Request, Response } from "express";
import Debug from "debug";
import { Signup } from "../application/Signup";
import { DAODatabaseFactory } from "../DAO/DB";

const app = express();
app.use(express.json());
const router = express.Router();
const signup = new Signup(new DAODatabaseFactory());

const debug = Debug("signup");
const reportError = Debug("error");

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;

    try {
        debug(input);
        const account = await signup.execute(input);
        debug(account);
        res.json(account);
    } catch (error) {
        reportError(error);

        if (error instanceof Error)
            res.status(422).json({ error: error.message });

        return;
    }
});

export default router;
