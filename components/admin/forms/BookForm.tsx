"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ColorPicker from "../ColorPicker";

// T takes the type whatever we pass into it
// as we don't know what the exact structure will look like
interface Props extends Partial<Book> {
  type?: 'create' | 'update'
}

const BookForm = ({
  type,
  ...book,

}: Props) => {

  const router = useRouter()

  const form: UseFormReturn<z.infer<typeof bookSchema>> = useForm({
    resolver: zodResolver(bookSchema), // signInSchema | signUpSchema
    defaultValues: {
      title: '',
      description: '',
      author: '',
      genre: '',
      rating: 1,
      totalCopies: 1,
      coverUrl: '',
      videoUrl: '',
      summary: '',
    }
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    console.log(values); 
  }

  //   toast('Hello World', {
  //   unstyled: true,
  //   classNames: {
  //     toast: 'bg-blue-400',
  //     title: 'text-red-400 text-2xl',
  //     description: 'text-red-400',
  //     actionButton: 'bg-zinc-400',
  //     cancelButton: 'bg-orange-400',
  //     closeButton: 'bg-lime-400',
  //   },
  // });

  return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
            <FormField
              control={form.control}
              name={"title"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal text-dark-500">
                    Book Title
                  </FormLabel>
                  <FormControl>
                    <Input 
                      required
                      placeholder="Book Title"
                      {...field}
                      className="book-form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name={"author"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal text-dark-500">
                    Author
                  </FormLabel>
                  <FormControl>
                    <Input 
                      required
                      placeholder="Author"
                      {...field}
                      className="book-form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name={"genre"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal text-dark-500">
                    Genre
                  </FormLabel>
                  <FormControl>
                    <Input 
                      required
                      placeholder="Book Genre"
                      {...field}
                      className="book-form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"rating"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal text-dark-500">
                    Rating
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min={1}
                      max={5}
                      placeholder="Book Rating"
                      {...field}
                      className="book-form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"totalCopies"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal text-dark-500">
                    Total Copies
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min={1}
                      max={10000}
                      placeholder="Total Copies"
                      {...field}
                      className="book-form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name={"coverUrl"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal text-dark-500">
                    Book Image
                  </FormLabel>
                  <FormControl>
                    <FileUpload 
                      type="image"
                      accept="image/*"
                      placeholder="Book Cover"
                      folder="books/cover"
                      variant="light"
                      onFileChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name={"coverColor"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal text-dark-500">
                    Primary Color
                  </FormLabel>
                  <FormControl>
                    <ColorPicker 
                      onPickerChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name={"description"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal text-dark-500">
                    Book Description
                  </FormLabel>
                  <FormControl>
                    {/* {...field} spreads those four props (name, value, onChange, onBlur, ref) onto the <Textarea> component (which itself forwards them to the underlying <textarea> element). */}
                    <Textarea 
                      placeholder="Book description" {...field}
                      rows={10} className="book-form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name={"videoUrl"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal text-dark-500">
                    Book Trailer
                  </FormLabel>
                  <FormControl>
                    <FileUpload 
                      type="video"
                      accept="video/*"
                      placeholder="Book Trailer"
                      folder="books/videos"
                      variant="light"
                      onFileChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name={"summary"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal text-dark-500">
                    Book Summary
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Book Summary" 
                      {...field}
                      className="book-form_input"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="book-form_btn text-white">
              Add Book to Library
            </Button>

        </form>
      </Form>
  );
};

export default BookForm;
