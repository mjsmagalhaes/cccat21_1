import Debug from "debug";
import { Account } from "../../entity/Account";
import { Asset } from "../../entity/Asset";
import { ConfigService } from "../../service/ConfigService";
import { AssetDAO } from "./../AssetDAO";
import { ERROR_MESSAGE } from "../../service/ErrorService";

const debug = Debug("db:asset");

export class AssetDAODatabase implements AssetDAO {
    static connection = ConfigService.getConnection();

    create(account: Account): Promise<{ accountId: string }> {
        throw new Error("Method not implemented.");
    }

    update(account: Account): void {
        throw new Error("Method not implemented.");
    }

    delete(account: Account): void {
        throw new Error("Method not implemented.");
    }

    async get(assetId: string): Promise<Asset> {
        const [asset] = await AssetDAODatabase.connection.query(
            "select * from ccca.asset a where a.ticker = ${asset_id}",
            { asset_id: assetId }
        );

        debug("asset_id:", assetId, "asset:", asset);

        if (asset == null) throw new Error(ERROR_MESSAGE.ASSET_NOT_FOUND);

        return asset;
    }

    async getAssets(): Promise<any[]> {
        return [];
    }
}
