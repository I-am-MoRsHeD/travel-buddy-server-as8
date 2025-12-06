import type { JwtPayload } from "jsonwebtoken";
import { Prisma, UserStatus } from "../../../../prisma/generated/prisma/client";
import config from "../../../config";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../errorHelpers/ApiError";
import { fileUploader } from "../../helpers/fileUploader";
import type { IUserCreateInput } from "./user.interface";
import bcrypt from 'bcryptjs';
import { pick } from "../../helpers/pick";
import calculatedPagination from "../../helpers/paginationHelpers";
import { userFilterableFields, userOptionItems, userSearchableFields } from "./user.constants";



const getAllUsers = async (query: Record<string, any>) => {
    const options = pick(query, userOptionItems);
    const filters = pick(query, userFilterableFields);

    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);
    const { searchTerm, ...filteredData } = filters;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filteredData.length > 0)) {
        andConditions.push({
            AND: Object.keys(filteredData).map(key => ({
                [key]: {
                    equals: (filteredData as any)[key]
                }
            }))
        })
    };

    const users = await prisma.user.findMany({
        skip,
        take: limit,

        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.user.count({
        where: {
            AND: andConditions
        }
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: users
    };

}

const getMyProfile = async (user: JwtPayload) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            avgRating: true,
            bio: true,
            currentLocation: true,
            fullName: true,
            isPremiumTaken: true,
            profilePhoto: true,
            travelInterests: true,
            visitedCountries: true,
            travelPlans: true,
            createdAt: true,
            reviewsReceived: {
                select: {
                    reviewFrom: true,
                    rating: true,
                    description: true
                }
            }
        }
    });

    return userInfo;
};

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

const updateProfile = async (id: string, user: JwtPayload, payload: Partial<IUserCreateInput>) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            id,
            status: UserStatus.ACTIVE
        }
    });

    if (payload.status && user.role !== 'ADMIN') {
        throw new ApiError(403, "You are not authorized to do that")
    };
    if (payload.currentLocation && user.role === 'ADMIN') {
        throw new ApiError(403, "You are not authorized to do that..")
    }
    if (payload.status && user.role === 'ADMIN') {
        await prisma.user.update({
            where: {
                id
            },
            data: {
                status: payload.status
            }
        })
    };

    const file = payload.file;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        payload.profilePhoto = uploadToCloudinary?.secure_url!;
    };

    const result = await prisma.user.update({
        where: {
            id
        },
        data: payload
    });

    return result;

};


export const UserService = {
    register,
    updateProfile,
    getAllUsers,
    getMyProfile
}