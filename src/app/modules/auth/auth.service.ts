import bcrypt from 'bcryptjs';
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../../config";
import ApiError from "../../errorHelpers/ApiError";
import httpStatus from 'http-status';
import { prisma } from '../../../lib/prisma';


const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload?.email,
        },
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    };

    const comparePassword = await bcrypt.compare(payload.password, user.password);

    if (!comparePassword) {
        throw new ApiError(400, 'Password is incorrect!');
    };

    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
    };

    const accessToken = jwtHelpers.generateToken(jwtPayload, config.jwt.jwt_access_secret, config.jwt.jwt_access_expires);
    const refreshToken = jwtHelpers.generateToken(jwtPayload, config.jwt.jwt_refresh_secret, config.jwt.jwt_refresh_expires);

    return {
        accessToken,
        refreshToken
    };
};


export const AuthService = {
    login,
};