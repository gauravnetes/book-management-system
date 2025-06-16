import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getInitials = (name: string): string => {
  return name.split(" ") // splitting the name in title and surname
    .map((part) => part[0]) // get only the first chars of each word 
    .join("") // join them with no space 
    .toUpperCase() // uppercase
    .slice(0, 2) // slice to only 2 chars if some names are longer
} 