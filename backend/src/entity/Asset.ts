import { Entity, IEntity } from "./core";

export interface AssetVO extends IEntity {
    ticker: string;
}

export class Asset extends Entity<AssetVO> { }