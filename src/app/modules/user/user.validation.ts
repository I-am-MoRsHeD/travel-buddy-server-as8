import z from "zod";


export const userRegisterZodSchema = z.object({
    fullName: z.string({
        error: "Full name is required"
    }),
    email: z.email("Invalid email address"),
    password: z.string("Password is required").min(6, "Password must be at least 6 characters long"),
});