import z from "zod";
import { UserStatus } from "../../../../prisma/generated/prisma/enums";


export const userRegisterZodSchema = z.object({
    fullName: z.string({
        error: "Full name is required"
    }),
    email: z.email("Invalid email address"),
    password: z.string("Password is required").min(6, "Password must be at least 6 characters long"),
});

export const userUpdateInfoZodSchema = z.object({
    fullName: z.string({
        error: "Full name is required"
    }).optional(),
    bio: z.string({ error: "Bio is required" }).min(1, "At least 1 word about yourself").max(300, "Maximum of 300 words about yourself").optional(),
    travelInterests: z.array(
        z.string().min(1, "At least 1 interest").max(10, "Maximum of 10 interest")
    ).optional(),
    visitedCountries: z.array(
        z.string().min(1, "At least 1 interest").max(10, "Maximum of 10 interest")
    ).optional(),
    currentLocation: z.string({
        error: "Current Location is required"
    }).min(1, "At least 1 word").max(20, "Maximum of 20 words").optional(),
    status: z.enum(Object.values(UserStatus) as [string]).optional()
});