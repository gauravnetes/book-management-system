import React from 'react'
import BookCard from './BookCard';

interface Props {
  title: string; 
  books: Book[]; 
  containerClassName?: string; 
}
const BookList = ({ title, books, containerClassName }: Props) => {
  if(books.length < 2) return; 
  
  return (
    <section className={containerClassName}>
        <h2 className='font-bebas-neue text-4xl text-light-100'>
            {title}
        </h2>
        {/* .book-list {
          @apply mt-10 flex flex-wrap gap-5 max-xs:justify-between xs:gap-10;
        } */}
          <ul className='book-list'>
          {books.map((book) => (
            <BookCard key={book.title} {...book} />
          ))}
        </ul>
    </section>
  )
}


export default BookList
