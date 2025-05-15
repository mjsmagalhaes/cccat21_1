export interface IEntity {
    id: string;
}

export class Entity<EntityDTO extends IEntity> {
    protected data: EntityDTO;

    constructor(vo: EntityDTO) {
        this.data = vo;
    }

    static create<E extends Entity<V>, V extends IEntity>(
        this: new (props: V) => E,
        vo: Omit<V, "id">
    ): E {
        return new this(
            Object.assign({}, vo, { id: crypto.randomUUID() }) as V
        );
    }

    getId() {
        return this.data.id;
    }

    toDto(): EntityDTO {
        return this.data;
    }
}
