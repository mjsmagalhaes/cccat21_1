import express, { Request, Response } from "express";
import crypto from "crypto";
import pgp from "pg-promise";

const app = express();
app.use(express.json());

// const accounts: any = [];
const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

async function getAccount(accountId: string) {
  try {
    const [account] = await connection.query(
      "select * from ccca.account acc where acc.account_id = ${account_id}",
      { account_id: accountId }
    );

    console.log('account_id:', accountId, 'account:', account);
    return account;
  } catch (error) {
    return null;
  }
}

async function getAsset(assetId: string) {
  try {
    const [asset] = await connection.query(
      "select * from ccca.asset a where a.ticker = ${asset_id}",
      { asset_id: assetId }
    );

    console.log('asset_id:', assetId, 'asset:', asset);
    return asset;
  } catch (error) {
    return null;
  }
}

async function createDeposit(account_id: string, asset_id: string, quantity: Number) {
  try {
    await connection.query(
      "insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",
      [account_id, asset_id, quantity]
    );
  } catch (error) {
    return null;
  }
}

app.post("/deposit", async (req: Request, res: Response) => {
  const input = req.body;

  const account = await getAccount(input.accountId);
  if (account == null) {
    return res.status(422).json({
      error: 'Account not found.'
    });
  }

  const asset = await getAsset(input.assetId)
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

  const deposit = createDeposit(account.account_id, asset.asset_id, input.quantity)
  if (deposit == null) {
    return res.status(422).json({
      error: 'Error creating deposit.'
    })
  }

  res.json({
    status: 'ok'
  });
});

app.get("/assets", async (req: Request, res: Response) => {

});

app.listen(3000);