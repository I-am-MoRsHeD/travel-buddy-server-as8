import z from "zod";


export const createReviewZodSchema = z.object({
    rating: z.number({
        error: "Rating is required"
    }).min(1, "At least 1 ").max(5, "Maximum of value 5"),
    description: z.string({
        error: "Description is required"
    }).min(1, "Minimum 1 word of description").max(200, "Maximum 200 word of description")
});

export const updateReviewZodSchema = z.object({
    rating: z.number({
        error: "Rating is required"
    }).min(1, "At least 1 ").max(5, "Maximum of value 5").optional(),
    description: z.string({
        error: "Description is required"
    }).min(1, "Minimum 1 word of description").max(200, "Maximum 200 word of description").optional()
});

