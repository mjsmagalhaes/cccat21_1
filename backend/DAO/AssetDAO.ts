import { Account } from "../entity/Account";
import { Asset } from "../entity/Asset";

export interface AssetDAO {
    create(account: Account): Promise<{ accountId: string }>;
    update(account: Account): void;
    delete(account: Account): void;
    getAsset(assetId: string): Promise<Asset>;
}
