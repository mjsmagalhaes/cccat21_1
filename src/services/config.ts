import config from "config";

export class Config {
    static getConnection = () => {
        console.log();
        return config.get<string>("connection");
    };
}
