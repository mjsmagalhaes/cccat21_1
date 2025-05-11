import { ERROR_MESSAGE } from "../service/ErrorService";
import { ValidationService } from "../service/ValidationService";
import { Entity, IEntity } from "./core";

export interface AccountVO extends IEntity {
    name: string;
    email: string;
    document: string;
    password: string;
}

export class Account extends Entity<AccountVO> {
    constructor(vo: AccountVO) {
        super(vo)

        this.validateName(vo.name);
        this.validateEmail(vo.email);
        this.validateDocument(vo.document);
        this.validatePassword(vo.password);
    }

    validateName(name: string) {
        if (!ValidationService.isValidName(name))
            throw new Error(ERROR_MESSAGE.INVALID_NAME);
    }

    validateEmail(email: string) {
        if (!ValidationService.isValidEmail(email))
            throw new Error(ERROR_MESSAGE.INVALID_EMAIL);
    }

    validateDocument(document: string) {
        if (!ValidationService.isValidDocument(document))
            throw new Error(ERROR_MESSAGE.INVALID_DOCUMENT);
    }

    validatePassword(password: string) {
        if (!ValidationService.isValidPassword(password))
            throw new Error(ERROR_MESSAGE.INVALID_PASSWORD);
    }
}

