import pgp from "pg-promise";
import config from "config";
import { AccountVO, AssetVO } from "../entity";

export class ConfigService {
    static connection: pgp.IDatabase<{}> | undefined = undefined;

    static getConnection = () => {
        if (this.connection == undefined)
            this.connection = pgp()(config.get<string>("connection"));

        return ConfigService.connection as pgp.IDatabase<{}>;
    };

    static getTestAccount = () => {
        return config.get<AccountVO>("test.account");
    };

    static getTestAsset = (asset: string) => {
        return config.get<AssetVO>("test.asset." + asset);
    };
}
