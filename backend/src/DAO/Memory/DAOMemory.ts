import { AbstractRepositoryFactory } from "../index";
import Debug from "debug";
import { IEntity, Account, Asset, Wallet, Order, Entity, OrderVO, WalletVO, AccountVO, AssetVO } from "../../entity";
import { ERROR_MESSAGE } from "../../service/ErrorService";
import { AccountRepository, AssetRepository, OrderRepository, WalletRepository } from "..";

const debug = Debug("dao:memory");

export class MemoryRepository<T extends Entity<V>, V extends IEntity = IEntity> {
    private data: T[];

    constructor(protected readonly entityConstructor: new (props: V) => T) {
        this.data = [];
    }

    getData() {
        return this.data;
    }

    async create(vo: V): Promise<T> {
        // vo.id = crypto.randomUUID();
        let entity = new this.entityConstructor(vo);
        this.data.push(entity);
        return entity;
    }

    async get(id: string): Promise<T> {
        const entity = this.data.find((entity) => entity.getId() === id);
        if (!entity) throw new Error(`${this.entityConstructor.name} not found.`);
        return entity;
    }

    async update(entity: T): Promise<T> {
        const index = this.data.findIndex((el) => el.getId() === entity.getId());
        this.data[index] = entity;
        return entity;
    }

    async getAll(): Promise<any[]> {
        return this.data;
    }

    async delete(id: string): Promise<void> {
        this.data = this.data.filter((entity) => entity.getId() !== id);
    }
}

export class AccountMemoryRepository
    extends MemoryRepository<Account, AccountVO>
    implements AccountRepository {

    constructor() {
        super(Account)
    }
}

export class AssetDAOMemory extends MemoryRepository<Asset, AssetVO> implements AssetRepository {
    constructor() {
        super(Asset)
    }

    async get(id: string): Promise<Asset> {
        debug("get", id);
        let asset = this.getData().find((el) => el.toVo().ticker === id);
        if (!asset) throw new Error(ERROR_MESSAGE.ASSET_NOT_FOUND);

        return asset;
    }
}

export class OrderDAOMemory extends MemoryRepository<Order, OrderVO> implements OrderRepository {
    constructor() {
        super(Order)
    }

    async getAssetOrders(asset: Asset): Promise<Order[]> {
        return this.getData()
            .filter((el) => el.toVo().asset_id === asset.getId())
            .sort((a, b) => b.toVo().price - a.toVo().price);
    }
}

export class WalletDAOMemory implements WalletRepository {
    base: MemoryRepository<Wallet, WalletVO> = new MemoryRepository<Wallet, WalletVO>(Wallet);

    async get(account_id: string, asset_id: string): Promise<Wallet> {
        let wallet = this.base.getData().find(
            (el) => el.toVo().account_id === account_id && el.toVo().asset_id === asset_id
        );

        if (!wallet) {
            wallet = await this.base.create({
                id: "",
                account_id,
                asset_id,
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
        const wallet = await this.get(account.getId(), asset.getId());

        if (wallet.toVo().quantity + quantity < 0)
            throw new Error(ERROR_MESSAGE.INSUFFICIENT_FUNDS);

        wallet.toVo().quantity += quantity;
        await this.base.update(wallet);

        return wallet;
    }
}

export class MemoryRepositoryFactory implements AbstractRepositoryFactory {
    private static readonly account = new AccountMemoryRepository();
    private static readonly asset = new AssetDAOMemory();
    private static readonly wallet = new WalletDAOMemory();
    private static readonly order = new OrderDAOMemory();

    createAccountDAO(): AccountRepository {
        return MemoryRepositoryFactory.account;
    }
    createAssetDAO(): AssetRepository {
        return MemoryRepositoryFactory.asset;
    }
    createWalletDAO(): WalletRepository {
        return MemoryRepositoryFactory.wallet;
    }
    createOrderDAO(): OrderRepository {
        return MemoryRepositoryFactory.order;
    }
}
