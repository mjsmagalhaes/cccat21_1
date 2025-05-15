import { Subject } from "rxjs";
import { AbstractRepositoryFactory } from "../../DAO";
import { GetDepth } from "./GetDepth";
import { PlaceOrder } from "./PlaceOrder";
import { ExecuteOrder } from "./ExecuteOrder";

export class OrderService {
    public readonly getDepth = new GetDepth(this.factory);
    public readonly placeOrder = new PlaceOrder(this.factory);
    public readonly executeOrder = new ExecuteOrder(this.factory);

    constructor(private readonly factory: AbstractRepositoryFactory) {}
}
