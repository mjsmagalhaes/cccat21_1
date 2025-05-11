import { AccountRepository, AbstractRepositoryFactory } from "../../DAO";
import { Account, AccountVO } from "../../entity";
import { UseCaseRequest, UseCase } from "../core/UseCase";

export class GetAccount implements UseCase {
    private readonly account: AccountRepository;

    constructor(factory: AbstractRepositoryFactory) {
        this.account = factory.createAccountDAO();
    }

    async execute(accountId: string) {
        return (await this.account.get(accountId)).toVo();
    }

    async handleRequest(request: UseCaseRequest): Promise<AccountVO> {
        return await this.execute(request.get('accountId'));
    }

    async validateRequest(request: UseCaseRequest): Promise<void> {
        let accountId = request.get('accountId');
        if (!accountId)
            throw new Error('Missing parameter')
    }
}
