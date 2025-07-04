"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// T takes the type whatever we pass into it
// as we don't know what the exact structure will look like
interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const isSignIn = (type === "SIGN_IN");
  const router = useRouter()
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema), // signInSchema | signUpSchema
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // 2. Define a submit handler.
  const handleSubmit: SubmitHandler<T> = async (data) => {
    const res = await onSubmit(data);
    if(res.success) {
      toast.success("Success", {
        description: isSignIn ? 
                      "You have successfully Signed In" : 
                      "You have Successfully Signed Up"
      })
      router.push('/');
    } else {
      toast.error(`Error ${isSignIn ? `Error Signing In` : `Error Signing Up`}`, {
        description: res.error ?? "An Error Occured", 
        dismissible: true, 
      })
    }
    
  };

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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome Back to BookWorm" : "Create Your Library Account"}
      </h1>

      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >

          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}<span className="text-red-700 ml-0 pl-0">*</span>
                  </FormLabel>
                  <FormControl>
                    {field.name === 'universityCard' ? (
                      <FileUpload 
                        type="image"
                        accept="image/*"
                        variant="dark"
                        folder="ids"
                        value={field.value}
                        placeholder="University ID"
                        onFileChange={(val) => field.onChange(val)}
                      />
                    ) : (
                      <Input required type={ FIELD_TYPES[field.name as keyof typeof FIELD_TYPES] }
                      {...field}
                      className="form-input"
                      />
                    )}
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Button>

        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New To BookWorm? " : "Already Have an Account? "}

        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-primary"
        >
          {isSignIn ? "Create an Account" : "Sign In"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
