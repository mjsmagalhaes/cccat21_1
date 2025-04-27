import { Response } from "express"

export enum ERROR_MESSAGE {
    ACCOUNT_NOT_FOUND = 'Account not found.',
    ASSET_NOT_FOUND = 'Asset not found.',
    INSUFFICIENT_FUNDS = 'Insufficient funds.',
    BAD_ORDER_REQUEST = 'Order missing information.',
    BAD_WITHDRAW_REQUEST = 'Bad Withdraw request.'
}

type ErrorMessage = keyof typeof ERROR_MESSAGE;

export function errorResponse(response: Response, message: ErrorMessage) {
    response.status(422).json({ error: ERROR_MESSAGE[message] });
}