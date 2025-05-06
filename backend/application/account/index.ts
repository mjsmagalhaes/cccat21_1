import { DAOAbstractFactory } from "../../DAO";
import { GetAccount } from "./GetAccount";
import { Signup } from "./Signup";

export class AccountService {
    public readonly getAccount = new GetAccount(this.factory);
    public readonly signup = new Signup(this.factory);

    constructor(private readonly factory: DAOAbstractFactory) {}
}
