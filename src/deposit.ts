import express, { Request, Response } from "express";
import { Database } from './db/db'
import Debug from 'debug'

const app = express();
app.use(express.json());

const debug = Debug('deposit')
// Debug.enable('deposit, db, error')
Debug.enable('deposit, error')



app.post("/deposit", async (req: Request, res: Response) => {
  const input = req.body;
  const db = new Database();
  const quantity = parseFloat(input.quantity);

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

  if (!input.quantity || isNaN(quantity) || quantity < 0) {
    return res.status(422).json({
      error: 'Wrong quantity.'
    })
  }

  const wallet = await db.getWallet(account.account_id, asset.asset_id);
  if (wallet == null) {
    debug(`Wallet ${account.account_id}:${asset.asset_id} not found. Creating ...`)
    await db.createWallet(account.account_id, asset.asset_id, quantity);
  } else {
    debug(`Wallet ${account.account_id}:${asset.asset_id} found. Updating ...`);
    await db.updateWallet(account.account_id, asset.asset_id, quantity + wallet.quantity);
  }

  const new_wallet = await db.getWallet(account.account_id, asset.asset_id);

  res.json({
    status: 'ok',
    quantity: new_wallet.quantity,
    asset_id: new_wallet.asset_id
  });
});

app.listen(3000);