import Debug from "debug";
import pgp from "pg-promise";
import { Wallet } from "./../../entity/Wallet";
import { ConfigService } from "../../service/ConfigService";
import { Account } from "../../entity/Account";
import { Asset } from "../../entity/Asset";

export interface WalletDAO {
    createOrUpdate(
        account: Account,
        asset: Asset,
        quantity: number
    ): Promise<Wallet>;
}

const debug = Debug("dao:wallet");
Debug.enable("dao:wallet");

export class WalletDAODatabase implements WalletDAO {
    static connection = ConfigService.getConnection();

    async getWallet(account: Account, asset: Asset): Promise<Wallet> {
        debug("getWallet", account, asset);

        let [wallet] = await WalletDAODatabase.connection.query(
            "select * from ccca.account_asset aa where aa.account_id = ${account_id} and aa.asset_id = ${asset_id}",
            { account_id: account.account_id, asset_id: asset.asset_id }
        );

        if (wallet == null)
            wallet = this.create(account.account_id, asset.asset_id, 0);

        (wallet as Wallet).quantity = parseFloat(wallet.quantity);

        debug("wallet:", wallet);
        return wallet;
    }

    private create = async (
        account_id: string,
        asset_id: string,
        quantity: Number
    ) => {
        await WalletDAODatabase.connection.query(
            "insert into ccca.account_asset (account_id, asset_id, quantity) values (${account_id}, ${asset_id}, ${quantity})",
            { account_id, asset_id, quantity }
        );
    };

    async update(account_id: string, asset_id: string, quantity: Number) {
        await WalletDAODatabase.connection.query(
            "update ccca.account_asset aa set quantity=${quantity} where aa.account_id=${account_id} and aa.asset_id=${asset_id};",
            { account_id, asset_id, quantity }
        );
    }

    async createOrUpdate(account: Account, asset: Asset, quantity: number) {
        const wallet = await this.getWallet(account, asset);

        await this.update(
            account.account_id,
            asset.asset_id,
            quantity + wallet.quantity
        );

        return await this.getWallet(account, asset);
    }
}
