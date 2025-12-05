import type { Country, TravelInterest, UserRole } from "../../../../prisma/generated/prisma/enums";



export interface IUserCreateInput {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    profilePhoto?: string | null;
    role?: UserRole;
    bio?: string | null;
    travelInterests?: TravelInterest[];
    visitedCountries?: Country[];
    currentLocation?: string;
    file?: Express.Multer.File;
}