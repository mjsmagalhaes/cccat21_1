import Debug from "debug";

import { AccountVO, AssetVO, WalletVO } from "../../entity";
import { DAODatabase } from "./DAODatabase";
import { WalletDAO } from "./..";

import { ERROR_MESSAGE } from "../../service/ErrorService";

const debug = Debug("db:wallet");

export class WalletDAODatabase extends DAODatabase implements WalletDAO {
    async getWallet(account: AccountVO, asset: AssetVO): Promise<WalletVO> {
        debug("get", account, asset);

        let [wallet] = await this.getConnection().query(
            "select * from ccca.account_asset where account_id = ${account_id} and asset_id = ${asset_id}",
            { account_id: account.id, asset_id: asset.id }
        );

        if (!wallet) {
            await this.create(account.id, asset.id, 0);
            wallet = await this.getWallet(account, asset);
        }

        debug("get:", wallet);
        (wallet as WalletVO).quantity = parseFloat(wallet.quantity);

        return wallet;
    }

    private async create(
        account_id: string,
        asset_id: string,
        quantity: Number
    ) {
        debug("create:", account_id, asset_id, quantity);

        await this.getConnection().query(
            "insert into ccca.account_asset (account_id, asset_id, quantity) values (${account_id}, ${asset_id}, ${quantity})",
            { account_id, asset_id, quantity }
        );
    }

    async update(account_id: string, asset_id: string, quantity: Number) {
        await this.getConnection().query(
            "update ccca.account_asset set quantity=${quantity} where account_id=${account_id} and asset_id=${asset_id};",
            { account_id, asset_id, quantity }
        );
    }

    async createOrUpdate(account: AccountVO, asset: AssetVO, quantity: number) {
        const wallet = await this.getWallet(account, asset);

        if (wallet.quantity + quantity < 0)
            throw new Error(ERROR_MESSAGE.INSUFFICIENT_FUNDS);

        await this.update(account.id, asset.id, quantity + wallet.quantity);

        return await this.getWallet(account, asset);
    }
}
