import type { JwtPayload } from "jsonwebtoken";
import { UserStatus, type Prisma } from "../../../../prisma/generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import type { CreateTravelPlan } from "./travelPlan.interface";



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


export const TravelPlanService = {
    createTravelPlan
}