import Debug from "debug";
import { AccountRepository, AbstractRepositoryFactory } from "../../DAO";
import { AccountVO } from "../../entity";
import { ValidationService } from "../../service/ValidationService";
import { ERROR_MESSAGE } from "../../service/ErrorService";

const debug = Debug("signup");

export class Signup {
    private readonly account: AccountRepository;

    constructor(factory: AbstractRepositoryFactory) {
        this.account = factory.createAccountDAO();
    }

    public async execute(account: AccountVO) {
        debug("execute");
        const { id: accountId } = (await this.account.create(account)).toVo();
        return { accountId };
    }
}
