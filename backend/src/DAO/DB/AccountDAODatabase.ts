import Debug from "debug";
import { Account, AccountVO } from "../../entity";
import { DatabaseRepository } from "./DAODatabase";
import { AccountRepository } from "..";

import { ERROR_MESSAGE } from "../../service/ErrorService";

const debug = Debug("db:account");

export class AccountDAODatabase extends DatabaseRepository implements AccountRepository {
    async create(accountVo: AccountVO): Promise<Account> {
        let account = Account.create(accountVo)

        await this.getConnection().query(
            "insert into ccca.account (id, name, email, document, password) values (${id}, ${name}, ${email}, ${document}, ${password})",
            account.toVo()
        );

        return account;
    }

    update(account: Account): void { }
    delete(accountId: string): void { }

    async get(accountId: string) {
        const [accountData] = await this.getConnection().query(
            "select * from ccca.account where id = $1",
            [accountId]
        );

        debug("get", accountId, accountData);

        if (!accountData) throw new Error(ERROR_MESSAGE.ACCOUNT_NOT_FOUND);

        return new Account(accountData) as Account;
    }
}
