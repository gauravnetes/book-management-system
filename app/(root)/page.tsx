import BookList from '@/components/BookList'
import BookOverview from '@/components/BookOverview'
import { sampleBooks } from '@/constants'
import { db } from '@/database/drizzle'
import { users } from '@/database/schema'
import React from 'react'

const Home = async () => {
  const res = await db.select().from(users)
  console.log(JSON.stringify(res, null, 2));
  
  return (
    <>
      <BookOverview {...sampleBooks[0]} />

      <BookList
        title="Latest Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  )
}

export default Home
