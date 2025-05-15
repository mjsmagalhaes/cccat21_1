import Debug from "debug";

import { Account, Asset, Wallet } from "../../domain/entity";
import { DatabaseRepository } from "./DAODatabase";
import { WalletRepository } from "..";

import { ERROR_MESSAGE } from "../../service/ErrorService";

const debug = Debug("db:wallet");

export class WalletDAODatabase
    extends DatabaseRepository
    implements WalletRepository
{
    async get(account_id: string, asset_id: string): Promise<Wallet> {
        debug("get", account_id, asset_id);

        let [walletVO] = await this.getConnection().query(
            "select * from ccca.account_asset where account_id = ${account_id} and asset_id = ${asset_id}",
            { account_id, asset_id }
        );

        if (!walletVO) {
            await this.create(account_id, asset_id, 0);
            walletVO = await this.get(account_id, asset_id);
        }

        debug("get:", walletVO);

        return new Wallet(walletVO);
    }

    private async create(
        account_id: string,
        asset_id: string,
        quantity: Number
    ) {
        debug("create:", account_id, asset_id, quantity);

        await this.getConnection().query(
            "insert into ccca.account_asset (${this:name}) values (${this:csv})",
            { account_id, asset_id, quantity }
        );

        return await this.get(account_id, asset_id);
    }

    async update(account_id: string, asset_id: string, quantity: Number) {
        const [data] = await this.getConnection().query(
            "update ccca.account_asset set quantity=${quantity} where account_id=${account_id} and asset_id=${asset_id};",
            { account_id, asset_id, quantity }
        );

        return new Wallet(data);
    }

    async createOrUpdate(account: Account, asset: Asset, quantity: number) {
        const wallet = await this.get(account.getId(), asset.getId());

        if (wallet.toDto().quantity + quantity < 0)
            throw new Error(ERROR_MESSAGE.INSUFFICIENT_FUNDS);

        await this.update(
            account.getId(),
            asset.getId(),
            quantity + wallet.toDto().quantity
        );

        return await this.get(account.getId(), asset.getId());
    }
}
