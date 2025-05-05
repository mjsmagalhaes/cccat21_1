import { Account, Asset, Order, Wallet } from "../entity";

export interface AccountDAO {
    create(account: Account): Promise<Account>;
    delete(accountId: string): void;
    get(accountId: string): Promise<Account>;
}

export interface AssetDAO {
    create(asset: Asset): Promise<Asset>;
    delete(assetId: string): void;
    get(assetId: string): Promise<Asset>;
}

export interface WalletDAO {
    getWallet(account: Account, asset: Asset): Promise<Wallet>;

    createOrUpdate(
        account: Account,
        asset: Asset,
        quantity: number
    ): Promise<Wallet>;
}

export interface OrderDAO {
    create(
        account: Account,
        asset: Asset,
        paymentAsset: Asset,
        side: string,
        quantity: number,
        price: number
    ): void;

    get(order_id: string): Promise<Order>;
}
