import express from "express";
import Debug from "debug";

import signup from "./signup";
import accounts from "./accounts";
import deposit from "./deposit";
import withdraw from "./withdraw";
import place_order from "./place_order";

// Debug.disable();
Debug.enable("place_order, withdraw, db:*, error");

const app = express();
app.use(express.json());

app.use("/signup", signup);
app.use("/accounts", accounts);
app.use("/deposit", deposit);
app.use("/withdraw", withdraw);
app.use("/place_order", place_order);

app.listen(3000);
