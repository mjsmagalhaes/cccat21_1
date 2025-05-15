import config from "config";
import { AccountDTO, AssetDTO } from "../domain/entity";

export class ConfigService {
    static getConnectionString() {
        return config.get<string>("connection");
    }

    static getHttpPort() {
        return config.get<number>("http.port");
    }

    static getWSPort() {
        return config.get<number>("ws.port");
    }

    static getTestAccount = () => {
        return config.get<AccountDTO>("test.account");
    };

    static getTestAsset = (asset: string) => {
        return config.get<AssetDTO>("test.asset." + asset);
    };
}
