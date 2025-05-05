import Debug from "debug";
import { Account } from "../../entity";
import { DAODatabase } from "./DAODatabase";
import { AccountDAO } from "..";

import { ERROR_MESSAGE } from "../../service/ErrorService";

const debug = Debug("db:account");

export class AccountDAODatabase extends DAODatabase implements AccountDAO {
    async create(account: Account): Promise<Account> {
        const accountId = crypto.randomUUID();

        await this.getConnection().query(
            "insert into ccca.account (id, name, email, document, password) values ($1, $2, $3, $4, $5)",
            [
                accountId,
                account.name,
                account.email,
                account.document,
                account.password,
            ]
        );

        return this.get(accountId);
    }

    update(account: Account): void {}
    delete(accountId: string): void {}

    async get(accountId: string) {
        const [accountData] = await this.getConnection().query(
            "select * from ccca.account where id = $1",
            [accountId]
        );

        debug("get", accountId, accountData);

        if (!accountData) throw new Error(ERROR_MESSAGE.ACCOUNT_NOT_FOUND);

        return accountData as Account;
    }
}
