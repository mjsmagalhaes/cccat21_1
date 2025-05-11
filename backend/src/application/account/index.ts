import { AbstractRepositoryFactory } from "../../DAO";
import { Withdraw } from "./Withdraw";
import { GetAccount } from "./GetAccount";
import { Signup } from "./Signup";
import { Deposit } from "./Deposit";

export class AccountService {
    public readonly getAccount = new GetAccount(this.factory);
    public readonly signup = new Signup(this.factory);
    public readonly withdraw = new Withdraw(this.factory);
    public readonly deposit = new Deposit(this.factory);

    constructor(private readonly factory: AbstractRepositoryFactory) { }
}
