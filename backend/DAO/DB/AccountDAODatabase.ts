import Debug from "debug";
import { AccountDAO } from "../AccountDAO";
import { Account } from "./../../entity/Account";
import { ERROR_MESSAGE } from "../../service/ErrorService";
import { DAODatabase } from "./DAODatabase";

const debug = Debug("db:account");

export class AccountDAODatabase extends DAODatabase implements AccountDAO {
    async create(account: Account): Promise<{ accountId: string }> {
        const accountId = crypto.randomUUID();

        await this.getConnection().query(
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

    update(account: Account): void { }
    delete(account: Account): void { }

    async get(accountId: string) {
        const [accountData] = await this.getConnection().query(
            "select * from ccca.account where account_id = $1",
            [accountId]
        );

        debug("get", accountId, accountData);

        if (!accountData) throw new Error(ERROR_MESSAGE.ACCOUNT_NOT_FOUND);

        return accountData as Account;
    }
}
