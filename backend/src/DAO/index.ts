import {
    Account,
    AccountDTO,
    Asset,
    AssetDTO,
    Order,
    OrderDTO,
    Wallet,
    WalletDTO,
} from "../domain/entity";

export interface AccountRepository {
    create(account: AccountDTO): Promise<Account>;
    delete(accountId: string): void;
    get(accountId: string): Promise<Account>;
}

export interface AssetRepository {
    create(asset: AssetDTO): Promise<Asset>;
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
    create(vo: Omit<OrderDTO, "id">): Promise<Order>;
    get(order_id: string): Promise<Order>;
    getAssetOrders(asset: Asset): Promise<Order[]>;
}

export interface AbstractRepositoryFactory {
    createAccountDAO(): AccountRepository;
    createAssetDAO(): AssetRepository;
    createWalletDAO(): WalletRepository;
    createOrderDAO(): OrderRepository;
}

export interface TradeRepository {
    account_id: string;
    asset_id: string;
    side: string;
    price: number;
    quantity: number;
}

export { MemoryRepositoryFactory } from "./Memory/DAOMemory";
export { DatabaseRepositoryFactory } from "./DB/Factory";
