"use client"

import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { borrowBook } from "@/lib/actions/book";

interface Props {
    userId: string; 
    bookId: string; 
    borrowingEligibility: {
        isEligible: boolean; 
        message: string; 
    }; 
}

const BorrowBook = ({ userId, bookId, borrowingEligibility }: Props) => {

    const router = useRouter(); 
    const [ borrowing, setBorrowing ] = useState(false);
    
    const handleBorrow = async () => {
        if(!borrowingEligibility.isEligible) {  
            toast.error("Error", {
                description: "User Not eligible to Borrow Books", 
            })
        }

        setBorrowing(true); 
        try {
            const res = await borrowBook({ bookId, userId })
            if(res.success) {
                toast.success("Success", {
                    description: "Book Borrowed Successfully"
                })
                router.push('/my-profile')
            } else {
                toast.error("Error", {
                    description: res.error, 
                })
            } 

        } catch (e) {
            toast.error("Error", {
                description: "An Error Occured while Borrowing The Book"
            }) 
        } finally {
            setBorrowing(false)
        }
    }

  return (
    <div>
      <Button className="book-overview_btn" onClick={handleBorrow} disabled={borrowing} >
        <Image src="icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">{borrowing ? 'Borrowing...' : "Borrow Book" }</p>
      </Button>
    </div>
  );
};

export default BorrowBook;
