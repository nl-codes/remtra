export interface ValidatedRequestData {
    body?: unknown;
    params?: unknown;
    query?: unknown;
}

declare global {
    namespace Express {
        interface Request {
            validated?: ValidatedRequestData;
        }
    }
}
