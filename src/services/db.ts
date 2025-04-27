import { Config } from "./config";
import pgp from "pg-promise";
import Debug from "debug";
import { Log } from "./log";
import type { Wallet } from "../tipos/Wallet";
import { Account } from "../tipos/Account";
import { Asset } from "../tipos/Asset";

const debug = Debug("db");
const log = new Log();

export class Database {
    static connection = pgp()(Config.getConnection());

    getAccount = async (accountId: string): Promise<Account | null> => {
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

    getAsset = async (assetId: string): Promise<Asset | null> => {
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

    getWallet = async (account: Account, asset: Asset): Promise<Wallet> => {
        let [wallet] = await Database.connection.query(
            "select * from ccca.account_asset aa where aa.account_id = ${account_id} and aa.asset_id = ${asset_id}",
            { account_id: account.account_id, asset_id: asset.asset_id }
        );

        if (wallet == null)
            wallet = this.createWallet(account.account_id, asset.asset_id, 0);

        (wallet as Wallet).quantity = parseFloat(wallet.quantity);

        debug("wallet:", wallet);
        return wallet;
    };

    private createWallet = async (
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

    createOrUpdateWallet = async (account: Account, asset: Asset, quantity: number) => {
        const wallet = await this.getWallet(account, asset);

        await this.updateWallet(
            account.account_id,
            asset.asset_id,
            quantity + wallet.quantity
        );

        return await this.getWallet(account, asset);
    }

    createOrder = async (account: Account, asset: Asset, paymentAsset: Asset, side: string, quantity: number, price: number) => {
        Database.connection.query(
            "insert into ccca.order(order_id,account_id,asset_id,asset_payment_id,side, quantity, price) values (${order_id},${account_id},${asset_id},${asset_payment_id},${side},${quantity},${price})",
            {
                order_id: crypto.randomUUID(),
                account_id: account.account_id,
                asset_id: asset.asset_id,
                asset_payment_id: paymentAsset.asset_id,
                side, quantity, price
            }
        )
    }
}
