import { config } from 'dotenv'
config({path: '.env.local'}); 

import dummyBooks from '@/dummybooks.json'
import ImageKit from 'imagekit'
import { books } from './schema'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(process.env.DATABASE_URL!); 
export const db = drizzle({ client: sql })

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
})


const uploadToImagekit = async (url: string, fileName: string, folder: string) => {
    try {
        const res = await imagekit.upload({
            file: url,
            fileName,
            folder 
        }); 

        return res.filePath; 
    } catch (error) {
        console.error("error uploading file to imagekit: ", error)
    }
}
 
const seed = async () => {
    console.log("Seeding data...");

    try {
        for (const book of dummyBooks) {
            const coverUrl = await uploadToImagekit(
                book.coverUrl, 
                `${book.title}.mp4`,
                "books/covers"
            ) as string; 

            const videoUrl = await uploadToImagekit(
                book.videoUrl, 
                `${book.title}.`, 
                "books/video"
            ) as string; 

            await db.insert(books).values({
                ...book, 
                coverUrl, // fix "return coverUrl as string"
                videoUrl
            }); 
        }

        console.log("Data seeded successfully")
    } catch (error) {
        console.error("Error seeding data", error)
    }
}

seed(); 