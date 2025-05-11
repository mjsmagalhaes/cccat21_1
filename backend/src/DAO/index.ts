import { Account, AccountVO, Asset, AssetVO, Order, OrderVO, Wallet, WalletVO } from "../entity";

export interface AccountRepository {
    create(account: AccountVO): Promise<Account>;
    delete(accountId: string): void;
    get(accountId: string): Promise<Account>;
}

export interface AssetRepository {
    create(asset: AssetVO): Promise<Asset>;
    delete(assetId: string): void;
    get(assetId: string): Promise<Asset>;
}

export interface WalletRepository {
    get(account: string, asset: string): Promise<Wallet>;

    createOrUpdate(
        account: Account,
        asset: Asset,
        quantity: number
    ): Promise<Wallet>;
}

export interface OrderRepository {
    create(vo: Omit<OrderVO, "id">): Promise<Order>;
    get(order_id: string): Promise<Order>;
    getAssetOrders(asset: Asset): Promise<Order[]>;
}

export interface AbstractRepositoryFactory {
    createAccountDAO(): AccountRepository;
    createAssetDAO(): AssetRepository;
    createWalletDAO(): WalletRepository;
    createOrderDAO(): OrderRepository;
}

export { MemoryRepositoryFactory } from "./Memory/DAOMemory"
export { DatabaseRepositoryFactory } from "./DB/Factory"