import { DatabaseRepository } from "./DAODatabase";
import Debug from "debug";
import { Account, Asset, AssetDTO } from "../../domain/entity";
import { AssetRepository } from "..";
import { ConfigService } from "../../service/ConfigService";
import { ERROR_MESSAGE } from "../../service/ErrorService";

const debug = Debug("db:asset");

export class AssetDAODatabase
    extends DatabaseRepository
    implements AssetRepository
{
    create(account: AssetDTO): Promise<Asset> {
        throw new Error("Method not implemented.");
    }

    update(account: Account): void {
        throw new Error("Method not implemented.");
    }

    delete(account: string): void {
        throw new Error("Method not implemented.");
    }

    async get(assetId: string): Promise<Asset> {
        const [asset] = await this.getConnection().query(
            "select * from ccca.asset a where a.ticker = ${asset_id}",
            { asset_id: assetId }
        );

        debug("get:", assetId, asset);

        if (!asset) throw new Error(ERROR_MESSAGE.ASSET_NOT_FOUND);

        return new Asset(asset);
    }

    async getAssets(): Promise<any[]> {
        return [];
    }
}
