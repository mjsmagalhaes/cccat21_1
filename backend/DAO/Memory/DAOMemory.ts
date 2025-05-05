import { IEntity, Account, Asset, Wallet, Order } from "../../entity";
import { ERROR_MESSAGE } from "../../service/ErrorService";
import { AccountDAO, AssetDAO, OrderDAO, WalletDAO } from "./../";

export class DAOMemory<T extends IEntity> {
    private data: T[];

    constructor() {
        this.data = [];
    }

    getData() {
        return this.data;
    }

    async create(entity: T): Promise<T> {
        this.data.push(entity);
        return entity;
    }

    async get(id: string): Promise<T> {
        const entity = this.data.find((entity) => entity.id === id);
        if (!entity) throw new Error(ERROR_MESSAGE.ENTITY_NOT_FOUND);
        return entity;
    }

    async update(entity: T): Promise<T> {
        const index = this.data.findIndex((el) => el.id === entity.id);
        this.data[index] = entity;
        return entity;
    }

    async getAll(): Promise<any[]> {
        return this.data;
    }

    async delete(id: string): Promise<void> {
        this.data = this.data.filter((entity) => entity.id !== id);
    }
}

export class AccountDAOMemory
    extends DAOMemory<Account>
    implements AccountDAO {}

export class AssetDAOMemory extends DAOMemory<Asset> implements AssetDAO {}

export class WalletDAOMemory extends DAOMemory<Wallet> implements WalletDAO {
    async getWallet(account: Account, asset: Asset): Promise<Wallet> {
        let wallet = this.getData().find(
            (el) => el.account_id === account.id && el.asset_id === asset.id
        );

        if (!wallet) {
            wallet = await this.create({
                id: "",
                account_id: account.id,
                asset_id: asset.id,
                quantity: 0,
            });
        }

        return wallet;
    }

    async createOrUpdate(
        account: Account,
        asset: Asset,
        quantity: number
    ): Promise<Wallet> {
        const wallet = await this.getWallet(account, asset);

        wallet.quantity += quantity;
        await this.update(wallet);

        return wallet;
    }
}

export class OrderDAOMemory extends DAOMemory<Order> implements OrderDAO {}
