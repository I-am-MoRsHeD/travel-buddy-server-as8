import { z } from "zod";
import { Country, TravelStatus, TravelType } from "../../../../prisma/generated/prisma/enums";

export const createTravelPlanZodSchema = z.object({
    destination: z.enum(Country, {
        error: "Destination is required"
    }),
    startDate: z.string({
        error: "Select an start date"
    }).or(z.date()),
    endDate: z.string({
        error: "Select an end date"
    }).or(z.date()),
    budgetRange: z.number({
        error: "Budget range is required"
    }).int().min(100, "Budget has to be at least 100"),
    travelType: z.enum(TravelType, {
        error: "Travel type is required"
    }),
    description: z.string({
        error: "Description is required"
    }).min(1, "At least 1 word").max(500, "Maximum 500 words"),
});

export const updateTravelPlanZodSchema = z.object({
    destination: z.enum(Country, {
        error: "Destination is required"
    }).optional(),
    startDate: z.string({
        error: "Select an start date"
    }).or(z.date()).optional(),
    endDate: z.string({
        error: "Select an end date"
    }).or(z.date()).optional(),
    budgetRange: z.number({
        error: "Budget range is required"
    }).int().min(100, "Budget has to be at least 100").optional(),
    travelType: z.enum(TravelType, {
        error: "Travel type is required"
    }).optional(),
    description: z.string({
        error: "Description is required"
    }).min(1, "At least 1 word").max(500, "Maximum 500 words").optional(),
});

export const updateTravelPlanStatusZodSchema = z.object({
    travelStatus: z.enum(TravelStatus, {
        error: "Travel status is required"
    })
});
