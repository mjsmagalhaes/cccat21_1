import express, { Request, Response } from "express";
import { Database } from './db/db'
import Debug from 'debug'

const app = express();
app.use(express.json());

const debug = Debug('deposit')
Debug.enable('deposit, error')


app.post("/deposit", async (req: Request, res: Response) => {
  const input = req.body;
  const db = new Database();

  const account = await db.getAccount(input.accountId);
  if (account == null) {
    return res.status(422).json({
      error: 'Account not found.'
    });
  }

  const asset = await db.getAsset(input.assetId)
  if (asset == null) {
    return res.status(422).json({
      error: 'Asset not found.'
    });
  }

  if (!input.quantity || input.quantity < 0) {
    return res.status(422).json({
      error: 'Wrong quantity.'
    })
  }

  const deposit = db.createDeposit(account.account_id, asset.asset_id, input.quantity)
  if (deposit == null) {
    return res.status(422).json({
      error: 'Error creating deposit.'
    })
  }

  res.json({
    status: 'ok'
  });
});

app.listen(3000);