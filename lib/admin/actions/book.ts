'use server'
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";

export const createBook = async (params: BookParams) => {
    try {
        const newBook = await db.insert(books).values({
            ...params,
            availableCopies: params.totalCopies, // all the books are available while creating the book for the first time
        }).returning(); // get the values back which were created in the db

        return {
            success: true, 
            data: JSON.parse(JSON.stringify(newBook[0]))
        }
    } catch (error) {
        console.log(error);
        return {
            success: false, 
            message: "An Error Occured while creating the Book"
        }
    }
}