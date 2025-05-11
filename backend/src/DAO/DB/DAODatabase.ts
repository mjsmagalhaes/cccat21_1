import { ConfigService } from "../../service/ConfigService";

export class DatabaseRepository {
    protected getConnection() {
        return ConfigService.getConnection();
    }
}
