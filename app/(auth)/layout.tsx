import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  if(session) redirect('/')
  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3">
            <Image src="/icons/logo.svg" alt="logo" width={37} height={37} />
            <h1 className="text-2xl font-semibold text-white">BookWorm</h1>
          </div>
          <div>{children}</div>  
        </div>
      </section>
        {/* .auth-illustration {
        @apply sticky h-40 w-full sm:top-0 sm:h-screen sm:flex-1;
        } */}
      <section className="auth-illustration">
            <Image 
                src="/images/auth-illustration.png"
                alt="auth illustration"
                height={1000}
                width={1000}
                className="size-full object-cover"
            />
      </section>
    </main>
  );
};

export default layout;
