import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth(); // check if the user have an active session.
  if (!session?.user?.id) redirect("/sign-in");

  // whether the currently logged in user is an Admin
  const isAdmin = await db
                  .select({isAdmin: users.role})
                  .from(users)
                  .where(eq(users.id, session.user.id)) // if this matches isAdmin will return true 
                  .limit(1)
                  .then((res) => res[0]?.isAdmin === 'ADMIN'); // if this matches isAdmin will return true

  if (!isAdmin) {
    redirect('/')
  }

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />

      <div className="admin-container">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};

export default layout;
