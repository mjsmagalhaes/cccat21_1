import { Entity, IEntity } from "./__core";

export interface AssetDTO extends IEntity {
    ticker: string;
}

export class Asset extends Entity<AssetDTO> {}
