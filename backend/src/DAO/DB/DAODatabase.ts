import { Application } from "../../application";

export class DatabaseRepository {
    protected getConnection() {
        return Application.getConnection();
    }
}
