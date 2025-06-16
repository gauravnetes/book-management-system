import { z } from 'zod'

export const signUpSchema = z.object({
    // keep it camelCase in The FrontEnd code. 
    // while switching to BackEnd squeeze it to smallcase as 
    // DB will take it in smallcase

    fullName: z.string().min(3),
    email: z.string().email(), 
    universityId: z.coerce.number(), // take a string and turn it into a number
    universityCard: z.string().nonempty('University Card is Required'), 
    password: z.string().min(8)
}); 

export const signInSchema = z.object({
    email: z.string().email(), 
    password: z.string().min(8),
})

