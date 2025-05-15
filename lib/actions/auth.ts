// server action for signing up users

// all functions here will only be called on the server side
'use server'

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";

export const signInWithCredentials = async (params: Pick<AuthCredentials, 'email' | 'password'>) => {
    const { email, password } = params;

    try {
        const res = await signIn('credentials', {
            email, 
            password, 
            redirect: false,
        })

        if (res?.error) {
            return { success: false, error: res.error}
        }

        return { success: true }
    } catch (error) {
        console.log("Sign In Error", error);
        return { success: false, error: "Sign In Error" }
    }
}

export const signUp = async (params: AuthCredentials) => {
    const { fullName, email, universityId, password, universityCard } = params

    const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    if (existingUser.length > 0) {
        return { success: false, error: "User Already Exists" }
    }

    const hashedPassword = await hash(password, 10); // salt: 10 => rounds of complexity

    try {
        await db.insert(users).values({
            fullName,
            email,
            universityId,
            password: hashedPassword,
            universityCard,
        });

        // To automate the sign in after the sign up 
        await signInWithCredentials({ email, password })

        return { success: true }
    } catch (error) {
        console.log(error, "Sign Up Error");
        return { success: false, error: "Sign up Error" }
    }
}; 