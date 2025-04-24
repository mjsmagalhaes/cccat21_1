import { Config } from "./config";
import pgp from "pg-promise";
import Debug from "debug";
import { Log } from "./log";
import type { Wallet } from "../tipos/Wallet";

const debug = Debug("db");
const log = new Log();

export class Database {
  static connection = pgp()(Config.getConnection());

  getAccount = async (accountId: string) => {
    try {
      const [account] = await Database.connection.query(
        "select * from ccca.account acc where acc.account_id = ${account_id}",
        { account_id: accountId }
      );

      debug("account_id:", accountId, "account:", account);

      return account;
    } catch (error) {
      log.reportError(error);
      return null;
    }
  };

  getAsset = async (assetId: string) => {
    try {
      const [asset] = await Database.connection.query(
        "select * from ccca.asset a where a.ticker = ${asset_id}",
        { asset_id: assetId }
      );

      debug("asset_id:", assetId, "asset:", asset);
      return asset;
    } catch (error) {
      log.reportError(error);
      return null;
    }
  };

  getWallet = async (account_id: string, asset_id: string) => {
    let [wallet] = await Database.connection.query(
      "select * from ccca.account_asset aa where aa.account_id = ${account_id} and aa.asset_id = ${asset_id}",
      { account_id, asset_id }
    );

    if (wallet) (wallet as Wallet).quantity = parseFloat(wallet.quantity);

    return wallet as Wallet;
  };

  createWallet = async (
    account_id: string,
    asset_id: string,
    quantity: Number
  ) => {
    await Database.connection.query(
      "insert into ccca.account_asset (account_id, asset_id, quantity) values (${account_id}, ${asset_id}, ${quantity})",
      { account_id, asset_id, quantity }
    );
  };

  updateWallet = async (
    account_id: string,
    asset_id: string,
    quantity: Number
  ) => {
    await Database.connection.query(
      "update ccca.account_asset aa set quantity=${quantity} where aa.account_id=${account_id} and aa.asset_id=${asset_id};",
      { account_id, asset_id, quantity }
    );
  };
}
