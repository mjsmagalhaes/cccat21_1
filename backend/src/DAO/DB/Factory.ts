import { AbstractRepositoryFactory } from "..";
import { AccountDAODatabase } from "./AccountDAODatabase";
import { AssetDAODatabase } from "./AssetDAODatabase";
import { OrderDAODatabase } from "./OrderDAODatabase";
import { WalletDAODatabase } from "./WalletDAODatabase";

export class DatabaseRepositoryFactory implements AbstractRepositoryFactory {
    createAccountDAO() {
        return new AccountDAODatabase();
    }
    createAssetDAO() {
        return new AssetDAODatabase();
    }
    createWalletDAO() {
        return new WalletDAODatabase();
    }
    createOrderDAO() {
        return new OrderDAODatabase();
    }
}
