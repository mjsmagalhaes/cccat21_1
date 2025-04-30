import Debug from "debug";
import { AccountDAO } from "../DAO/AccountDAO";
import { Account } from "../entity/Account";
import { ValidationService } from "../service/ValidationService";
import { ErrorService, ERROR_MESSAGE } from "../service/ErrorService";

const debug = Debug("signup");

export class Signup {
    constructor(private readonly account: AccountDAO) {}

    public async execute(account: Account) {
        debug("Execute");
        if (!ValidationService.isValidName(account.name))
            ErrorService.throwError(ERROR_MESSAGE.INVALID_NAME);
        if (!ValidationService.isValidEmail(account.email))
            ErrorService.throwError(ERROR_MESSAGE.INVALID_EMAIL);
        if (!ValidationService.isValidPassword(account.password))
            ErrorService.throwError(ERROR_MESSAGE.INVALID_PASSWORD);
        if (!ValidationService.isValidDocument(account.document))
            ErrorService.throwError(ERROR_MESSAGE.INVALID_DOCUMENT);

        debug("Criando conta");
        const { accountId } = await this.account.create(account);

        return { accountId };
    }
}
