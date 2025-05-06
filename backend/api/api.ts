import express from "express";
import Debug from "debug";
import { WebSocketExpress } from "websocket-express";
import signup from "./signup";
import accounts from "./accounts";
import deposit from "./deposit";
import withdraw from "./withdraw";
import place_order from "./place_order";
import live from "./live";

Debug.disable();
// Debug.enable("place_order,withdraw,deposit,db:*,error");
Debug.enable("place_order,live");

const app = new WebSocketExpress();

app.use(express.json());

app.use("/signup", signup);
app.use("/accounts", accounts);
app.use("/deposit", deposit);
app.use("/withdraw", withdraw);
app.use("/place_order", place_order);
app.use("/live", live);

app.listen(3000);
