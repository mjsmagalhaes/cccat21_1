import Debug from "debug";
import { AbstractRepositoryFactory, AccountRepository } from "../../DAO";
import { AccountDTO } from "../../domain/entity";

const debug = Debug("signup");

export class Signup {
    private readonly account: AccountRepository;

    constructor(factory: AbstractRepositoryFactory) {
        this.account = factory.createAccountDAO();
    }

    public async execute(account: AccountDTO) {
        debug("execute");
        const { id: accountId } = (await this.account.create(account)).toDto();
        return { accountId };
    }
}
