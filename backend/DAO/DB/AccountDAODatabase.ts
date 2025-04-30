import pgp from "pg-promise";
import { AccountDAO } from "../AccountDAO";
import { Account } from "./../../entity/Account";
import { ConfigService } from "../../service/ConfigService";

export class AccountDAODatabase implements AccountDAO {
    static connection = ConfigService.getConnection();

    async create(account: Account): Promise<{ accountId: string }> {
        const accountId = crypto.randomUUID();

        await AccountDAODatabase.connection.query(
            "insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)",
            [
                accountId,
                account.name,
                account.email,
                account.document,
                account.password,
            ]
        );

        return { accountId };
    }

    update(account: Account): void {}
    delete(account: Account): void {}

    async getAccount(accountId: string) {
        const [accountData] = await AccountDAODatabase.connection.query(
            "select * from ccca.account where account_id = $1",
            [accountId]
        );

        return accountData as Account;
    }
}
