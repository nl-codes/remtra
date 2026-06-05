import type { Request } from "express";
import { AppError } from "../middlewares/error.middleware.js";

const getValidatedData = <T>(
    req: Request,
    source: "body" | "query" | "params",
): T => {
    if (!req.validated || !req.validated[source]) {
        throw new AppError(`Validated request ${source} is missing`);
    }
    return req.validated[source] as T;
};

export const getValidatedBody = <T>(req: Request): T => {
    return getValidatedData<T>(req, "body");
};

export const getValidatedQuery = <T>(req: Request): T => {
    return getValidatedData<T>(req, "query");
};

export const getValidatedParams = <T>(req: Request): T => {
    return getValidatedData<T>(req, "params");
};
