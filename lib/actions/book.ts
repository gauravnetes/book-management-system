"use server"

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs"

export const borrowBook = async (params: BorrowBookParams) => {
    const { userId, bookId } = params;

    try {
        const book = await db
        .select({ availableCopies: books.availableCopies })
        .from(books)
        .where(eq(books.id, bookId))
        .limit(1) 

        if (!book.length || book[0].availableCopies <= 0) {
            return {
                success: false, 
                error: "Book is Not Available for Borrowing"
            }
        }

        // dueDate => 7 days from today (borrow date)
        const dueDate = dayjs().add(7, 'day').toDate().toDateString(); 

        // borrowRecords db table 
        const record = await db.insert(borrowRecords).values({
            userId, 
            bookId, 
            dueDate, 
            status: "BORROWED"
        })

        // after borrowing reduce the availableCopies by updating the db
        await db.update(books)
            .set({ availableCopies: book[0].availableCopies - 1 })
            .where(eq(books.id, bookId)) 


        return {
            success: true, 
            data: JSON.parse(JSON.stringify(record)) 
        }
    } catch (error) {
        console.log(error);

        return {
            success: false,
            error: "An Error occured while Book Borrowing"
        };
    }
}