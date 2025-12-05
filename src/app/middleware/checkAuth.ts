import type { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../helpers/jwtHelpers";
import ApiError from "../errorHelpers/ApiError";
import httpStatus from "http-status";
import config from "../../config";


const checkAuth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.accessToken;

            if (!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
            };

            const verifyUser = jwtHelpers.verifyToken(token, config.jwt.jwt_access_secret);

            if (roles.length && !roles.includes(verifyUser?.role)) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
            };

            req.user = verifyUser;

            next();

        } catch (error) {
            next(error);
        }
    };
};


export default checkAuth;