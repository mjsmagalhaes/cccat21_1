export interface IEntity {
    id: string;
}

export class Entity<EntityVO extends IEntity> {
    protected data: EntityVO;

    constructor(vo: EntityVO) {
        this.data = vo
    }

    static create<E extends Entity<V>, V extends IEntity>(
        this: new (props: V) => E,
        vo: Omit<V, 'id'>): E {
        return new this(Object.assign({}, vo, { id: crypto.randomUUID() }) as V);
    }

    getId() {
        return this.data.id;
    }

    toVo(): EntityVO {
        return this.data;
    }
}