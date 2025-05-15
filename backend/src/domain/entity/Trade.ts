export interface TradeDTO {}

export class Trade {
    constructor(private readonly props: TradeDTO) {}

    toDto(): TradeDTO {
        return this.props;
    }
}
