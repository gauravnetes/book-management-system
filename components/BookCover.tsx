import React from 'react'

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide"

const variantStyles: Record<BookCoverVariant, string> = {
    extraSmall: 'book-cover_extra_small', 
    small: 'book-cover_small', 
    medium: 'book-cover_medium', 
    regular: 'book-cover_regular', 
    wide: 'book-cover_wide',
}

interface Props {
    className?: string; 
    variant?: BookCoverVariant; 
    coverColor: string; 
    coverUrl: string; 
}

const BookCover = ({ 
    className,
    vairant = "regular",
    coverColor = '#012B48', 
    coverUrl = "https://placehold.co/400*600.png"
}: Props) => {
  return (
    <div className=''>
      
    </div>
  )
}

export default BookCover
