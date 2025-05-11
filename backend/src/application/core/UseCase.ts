export class UseCaseRequest {
    data: { [key: string]: any } = {}
    get<T = string | undefined>(key: string) { return this.data[key] as string; }
    set(key: string, value: any) { this.data[key] = value; }
}

export abstract class UseCase {
    abstract handleRequest(request: UseCaseRequest): Promise<any>;
    abstract validateRequest(request: UseCaseRequest): Promise<void>;
}

export class UseCaseSO extends UseCase {
    private readonly it: UseCaseIterator

    constructor() {
        super();
        this.it = new BasicUseCaseIterator();
    }

    addUseCase(newUseCase: UseCase) {
        this.it.push(newUseCase);
    }

    async handleRequest(request: UseCaseRequest): Promise<any> {
        let result;

        while (this.it.hasNext()) {
            let useCase = await this.it.next(request);
            if (useCase) {
                await useCase.validateRequest(request);
                result = await useCase.handleRequest(request);
            }
        }

        return result;
    }

    async validateRequest(request: UseCaseRequest): Promise<void> {
        try {
            while (this.it.hasNext()) {
                let useCase = await this.it.next(request);
                if (useCase) {
                    await useCase.validateRequest(request);
                }
            }
        } catch (e) {
            throw e;
        }
        finally {
            this.it.reset();
        }
    }
}

export interface UseCaseIterator {
    next(request: UseCaseRequest): Promise<UseCase | undefined>;
    hasNext(): boolean;
    push(uc: UseCase): void;
    reset(): void;
}

export class BasicUseCaseIterator implements UseCaseIterator {
    useCases: UseCase[] = []
    index: number = 0;

    async next(): Promise<UseCase | undefined> {
        if (!this.hasNext())
            return undefined

        return this.useCases[this.index++]
    }

    hasNext(): boolean {
        return this.index >= this.useCases.length;
    }

    push(uc: UseCase): void {
        this.useCases.push(uc);
    }

    reset(): void {
        this.index = 0;
    }
}