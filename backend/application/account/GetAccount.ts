import { AccountDAO, DAOAbstractFactory } from "../../DAO";

export class GetAccount {
    private readonly account: AccountDAO;

    constructor(factory: DAOAbstractFactory) {
        this.account = factory.createAccountDAO();
    }
    async execute(accountId: string) {
        return await this.account.get(accountId);
    }
}
