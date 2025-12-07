import { z } from "zod";
import { Country, TravelType } from "../../../../prisma/generated/prisma/enums";

export const CreateTravelPlanSchema = z.object({
    destination: z.enum(Object.values(Country) as [string], {
        error: "Destination is required"
    }),
    startDate: z.string({
        error: "Select an start date"
    }).or(z.date()),
    endDate: z.string({
        error: "Select an end date"
    }).or(z.date()),
    budgetRange: z.number().int().min(100, "Budget has to be at least 100"),
    travelType: z.enum(Object.values(TravelType), {
        error: "Travel type is required"
    }),
    description: z.string({
        error: "Description is required"
    }).min(1, "At least 1 word").max(500, "Maximum 500 words"),
});
