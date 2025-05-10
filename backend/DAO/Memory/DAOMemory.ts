import { DAOAbstractFactory } from "./../index";
import Debug from "debug";
import { IEntity, AccountVO, AssetVO, WalletVO, OrderVO } from "../../entity";
import { ERROR_MESSAGE } from "../../service/ErrorService";
import { AccountDAO, AssetDAO, OrderDAO, WalletDAO } from "./../";

const debug = Debug("dao:memory");

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
        // console.log(this.data);
        // console.log(id);
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
    extends DAOMemory<AccountVO>
    implements AccountDAO {}

export class AssetDAOMemory extends DAOMemory<AssetVO> implements AssetDAO {
    async get(id: string): Promise<AssetVO> {
        debug("get", id);
        let asset = this.getData().find((el) => el.ticker === id);
        if (!asset) throw new Error(ERROR_MESSAGE.ASSET_NOT_FOUND);

        return asset;
    }
}

export class WalletDAOMemory extends DAOMemory<WalletVO> implements WalletDAO {
    async getWallet(account: AccountVO, asset: AssetVO): Promise<WalletVO> {
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
        account: AccountVO,
        asset: AssetVO,
        quantity: number
    ): Promise<WalletVO> {
        const wallet = await this.getWallet(account, asset);

        wallet.quantity += quantity;
        await this.update(wallet);

        return wallet;
    }
}

export class OrderDAOMemory extends DAOMemory<OrderVO> implements OrderDAO {
    async getAssetOrders(asset: AssetVO): Promise<OrderVO[]> {
        return this.getData()
            .filter((el) => el.asset_id === asset.id)
            .sort((a, b) => b.price - a.price);
    }

    async createOrder(
        account: AccountVO,
        asset: AssetVO,
        paymentAsset: AssetVO,
        side: string,
        quantity: number,
        price: number
    ): Promise<OrderVO> {
        const order = {
            id: crypto.randomUUID(),
            account_id: account.id,
            asset_id: asset.id,
            asset_payment_id: paymentAsset.id,
            side,
            quantity,
            price,
        };

        return await super.create(order);
    }
}

export class DAOMemoryFactory implements DAOAbstractFactory {
    private static readonly account = new AccountDAOMemory();
    private static readonly asset = new AssetDAOMemory();
    private static readonly wallet = new WalletDAOMemory();
    private static readonly order = new OrderDAOMemory();

    createAccountDAO(): AccountDAO {
        return DAOMemoryFactory.account;
    }
    createAssetDAO(): AssetDAO {
        return DAOMemoryFactory.asset;
    }
    createWalletDAO(): WalletDAO {
        return DAOMemoryFactory.wallet;
    }
    createOrderDAO(): OrderDAO {
        return DAOMemoryFactory.order;
    }
}
