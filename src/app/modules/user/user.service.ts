import config from "../../../config";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../errorHelpers/ApiError";
import type { IUserCreateInput } from "./user.interface";
import bcrypt from 'bcryptjs';


const register = async (payload: IUserCreateInput) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    });
    if (isUserExist) {
        throw new ApiError(400, "User already exists")
    };

    const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));

    const result = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword
        }
    })

    return result;

};

const getUsers = async() =>{};

export const UserService = {
    register
}