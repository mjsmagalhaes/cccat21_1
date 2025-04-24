import pgp from "pg-promise";
import Debug from 'debug'
import { Log } from './log'

const debug = Debug('db');
const log = new Log();

export class Database {
  static connection = pgp()("postgres://postgres:123456@localhost:5432/app");

  getAccount = async (accountId: string) => {
    try {
      const [account] = await Database.connection.query(
        "select * from ccca.account acc where acc.account_id = ${account_id}",
        { account_id: accountId }
      );

      debug('account_id:', accountId, 'account:', account);

      return account;
    } catch (error) {
      log.reportError(error);
      return null;
    }
  }

  getAsset = async (assetId: string) => {
    try {
      const [asset] = await Database.connection.query(
        "select * from ccca.asset a where a.ticker = ${asset_id}",
        { asset_id: assetId }
      );

      debug('asset_id:', assetId, 'asset:', asset);
      return asset;
    } catch (error) {
      log.reportError(error)
      return null;
    }
  }

  createDeposit = async (account_id: string, asset_id: string, quantity: Number) => {
    try {
      await Database.connection.query(
        "insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",
        [account_id, asset_id, quantity]
      );
    } catch (error) {
      return null;
    }
  }
}