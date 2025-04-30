import express, { Request, Response } from "express";
import Debug from "debug";

import signup from "./signup";
import accounts from "./accounts";
import deposit from "./deposit";
import withdraw from "./withdraw";

Debug.enable("deposit, withdraw");

const app = express();
app.use(express.json());
const router = express.Router();

app.use("/signup", signup);
app.use("/accounts", accounts);
app.use("/deposit", deposit);
app.use("/withdraw", withdraw);

app.listen(3000);
