import Debug from "debug";
import { AccountDAO } from "../DAO";
import { Account } from "../entity";
import { ValidationService } from "../service/ValidationService";
import { ERROR_MESSAGE } from "../service/ErrorService";

const debug = Debug("signup");

export class Signup {
    constructor(private readonly account: AccountDAO) {}

    public async execute(account: Account) {
        debug("Execute");
        if (!ValidationService.isValidName(account.name))
            throw new Error(ERROR_MESSAGE.INVALID_NAME);
        if (!ValidationService.isValidEmail(account.email))
            throw new Error(ERROR_MESSAGE.INVALID_EMAIL);
        if (!ValidationService.isValidPassword(account.password))
            throw new Error(ERROR_MESSAGE.INVALID_PASSWORD);
        if (!ValidationService.isValidDocument(account.document))
            throw new Error(ERROR_MESSAGE.INVALID_DOCUMENT);

        debug("Criando conta");
        const { id: accountId } = await this.account.create(account);

        return { accountId };
    }
}
