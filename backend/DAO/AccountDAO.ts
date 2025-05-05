import { Account } from "../entity/Account";

export interface AccountDAO {
    create(account: Account): Promise<{ accountId: string }>;
    update(account: Account): void;
    delete(account: Account): void;
    get(accountId: string): Promise<Account>;
}
