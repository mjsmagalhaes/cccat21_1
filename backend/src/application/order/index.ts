import { Subject } from "rxjs";
import { AbstractRepositoryFactory } from "../../DAO";
import { GetDepth } from "./GetDepth";
import { PlaceOrder } from "./PlaceOrder";

export class OrderService {
    public readonly getDepth = new GetDepth(this.factory);
    public readonly placeOrder = new PlaceOrder(this.factory);

    constructor(private readonly factory: AbstractRepositoryFactory) { }
}
