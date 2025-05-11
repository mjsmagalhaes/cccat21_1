import express from "express";
import Debug from "debug";
import { WebSocketExpress } from "websocket-express";
import { accounts, deposit, withdraw, signup, place_order, live } from "../interfaces/controllers";


Debug.disable();
// Debug.enable("place_order,withdraw,deposit,db:*,error:*,controller:*");
Debug.enable("controller:*");

const app = new WebSocketExpress();

app.use(express.json());

app.use("/signup", signup);
app.use("/accounts", accounts);
app.use("/deposit", deposit);
app.use("/withdraw", withdraw);
app.use("/place_order", place_order);
app.use("/live", live);

app.listen(3000);
