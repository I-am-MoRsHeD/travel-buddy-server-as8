import type { JwtPayload } from "jsonwebtoken";
import { UserStatus, type Prisma } from "../../../../prisma/generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import type { CreateTravelPlan } from "./travelPlan.interface";
import { pick } from "../../helpers/pick";
import calculatedPagination from "../../helpers/paginationHelpers";
import { travelPlansFilterableFields, travelPlansOptionItems } from "./travelPlan.constants";
import ApiError from "../../errorHelpers/ApiError";



const createTravelPlan = async (user: JwtPayload, payload: CreateTravelPlan) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            id: user?.userId,
            status: UserStatus.ACTIVE
        }
    });
    return await prisma.travelPlan.create({
        data: {
            ...payload,
            creator_id: userInfo.id
        }
    })
};

const getMyTravelPlans = async (user: JwtPayload, query: Record<string, any>) => {
    const options = pick(query, travelPlansOptionItems);
    const filters = pick(query, travelPlansFilterableFields);

    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);
    const { searchTerm, ...filteredData } = filters;

    const andConditions: Prisma.TravelPlanWhereInput[] = [];

    if (searchTerm) {
        const amount = Number(searchTerm);

        andConditions.push({
            budgetRange: { gte: amount }
        });
    };

    if (Object.keys(filteredData).length > 0) {
        andConditions.push({
            AND: Object.keys(filteredData).map(key => ({
                [key]: {
                    equals: (filteredData as any)[key]
                }
            }))
        })
    };

    const travels = await prisma.travelPlan.findMany({
        skip,
        take: limit,

        where: {
            AND: andConditions,
            creator_id: user.userId
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.travelPlan.count({
        where: {
            AND: andConditions,
            creator_id: user.id
        }
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: travels
    };

};

const getAllTravelPlans = async (query: Record<string, any>) => {
    const options = pick(query, travelPlansOptionItems);
    const filters = pick(query, travelPlansFilterableFields);

    const { page, limit, skip, sortBy, sortOrder } = calculatedPagination(options);
    const { searchTerm, ...filteredData } = filters;

    const andConditions: Prisma.TravelPlanWhereInput[] = [];

    if (searchTerm) {
        const amount = Number(searchTerm);

        andConditions.push({
            budgetRange: { gte: amount }
        });
    };

    if (Object.keys(filteredData).length > 0) {
        andConditions.push({
            AND: Object.keys(filteredData).map(key => ({
                [key]: {
                    equals: (filteredData as any)[key]
                }
            }))
        })
    };

    const travels = await prisma.travelPlan.findMany({
        skip,
        take: limit,

        where: {
            AND: andConditions,
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.travelPlan.count({
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
        data: travels
    };

};

const updateTravelPlan = async (id: string, user: JwtPayload, payload: Prisma.TravelPlanUpdateInput) => {

    const existingPlan = await prisma.travelPlan.findUnique({
        where: { id }
    });

    if (!existingPlan) {
        throw new ApiError(404, "Travel plan not found.");
    };

    if (existingPlan.creator_id !== user.userId) {
        throw new ApiError(403, "You are not allowed to update this travel plan.");
    }

    delete payload.creator;
    delete payload.id;

    const updatedPlan = await prisma.travelPlan.update({
        where: { id },
        data: payload
    });

    return updatedPlan;
};

const updateTravelStatus = async (id: string, payload: Prisma.TravelPlanUpdateInput) => {

    const updateTravelPlanStatus = await prisma.travelPlan.update({
        where: {
            id
        },
        data: payload
    })

    return updateTravelPlanStatus;
};

const deleteTravelPlan = async (id: string, user: JwtPayload) => {

    const existingPlan = await prisma.travelPlan.findUniqueOrThrow({
        where: {
            id
        }
    });

    if (existingPlan.creator_id !== user.userId) {
        throw new ApiError(403, "You are not allowed to update this travel plan.");
    }

    const result = await prisma.travelPlan.delete({
        where: {
            id,
        },
    });

    return result;
};

export const TravelPlanService = {
    createTravelPlan,
    getAllTravelPlans,
    getMyTravelPlans,
    updateTravelPlan,
    updateTravelStatus,
    deleteTravelPlan
}