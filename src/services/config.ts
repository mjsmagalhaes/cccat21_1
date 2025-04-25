import config from "config";

export class Config {
    static getConnection = () => {
        return config.get<string>("connection");
    };

    static getTestAccount = () => {
        return config.get<string>("test.account");
    };
}
