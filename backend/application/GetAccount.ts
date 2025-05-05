import { AccountDAO } from "../DAO";

export class GetAccount {
    constructor(private readonly account: AccountDAO) {}
    async execute(accountId: string) {
        return await this.account.get(accountId);
    }
}
