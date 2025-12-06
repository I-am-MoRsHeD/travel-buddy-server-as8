import type { Country, TravelInterest, UserRole, UserStatus } from "../../../../prisma/generated/prisma/enums";



export interface IUserCreateInput {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    profilePhoto?: string | null;
    role?: UserRole;
    avgRating?: number;
    isPremiumTaken?: boolean;
    bio?: string | null;
    status: UserStatus;
    travelInterests?: TravelInterest[];
    visitedCountries?: Country[];
    currentLocation?: string;
    file?: Express.Multer.File;
}