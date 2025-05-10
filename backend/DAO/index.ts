import { AccountVO, AssetVO, OrderVO, WalletVO } from "../entity";

export interface AccountDAO {
    create(account: AccountVO): Promise<AccountVO>;
    delete(accountId: string): void;
    get(accountId: string): Promise<AccountVO>;
}

export interface AssetDAO {
    create(asset: AssetVO): Promise<AssetVO>;
    delete(assetId: string): void;
    get(assetId: string): Promise<AssetVO>;
}

export interface WalletDAO {
    getWallet(account: AccountVO, asset: AssetVO): Promise<WalletVO>;

    createOrUpdate(
        account: AccountVO,
        asset: AssetVO,
        quantity: number
    ): Promise<WalletVO>;
}

export interface OrderDAO {
    createOrder(
        account: AccountVO,
        asset: AssetVO,
        paymentAsset: AssetVO,
        side: string,
        quantity: number,
        price: number
    ): Promise<OrderVO>;

    get(order_id: string): Promise<OrderVO>;
    getAssetOrders(asset: AssetVO): Promise<OrderVO[]>;
}

export interface DAOAbstractFactory {
    createAccountDAO(): AccountDAO;
    createAssetDAO(): AssetDAO;
    createWalletDAO(): WalletDAO;
    createOrderDAO(): OrderDAO;
}
