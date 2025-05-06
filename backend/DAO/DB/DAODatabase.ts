import { ConfigService } from "../../service/ConfigService";

export class DAODatabase {
    protected getConnection() {
        return ConfigService.getConnection();
    }
}
