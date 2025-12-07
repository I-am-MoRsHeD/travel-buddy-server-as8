import { Country, TravelStatus, TravelType } from "../../../../prisma/generated/prisma/enums";


export interface CreateTravelPlan {
    id?: string;
    destination: Country;
    startDate: Date | string;
    endDate: Date | string;
    budgetRange: number;
    travelType: TravelType;
    travelStatus?: TravelStatus;
    description: string;
    interestedMembers?: string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    creator_id: string;
}