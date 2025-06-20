import { serve } from "@upstash/workflow/nextjs"
import emailjs from "@emailjs/nodejs"
type InitialData = {
  email: string
}

export const { POST } = serve<InitialData>(async (context) => {
  const { email } = context.requestPayload

// send newly signed-up user a welcome email
  await context.run("new-signup", async () => {
    await sendEmail("Welcome to the platform", email)
  })

// context.sleep() to pause our workflow for 3 days to let user get familiar with the platform 
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3)

// infinite loop to periodically check the user's engagement level wtth our platform   
  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState()
    })

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail("Email to non-active users", email)
      })
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail("Send newsletter to active users", email)
      })
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
  }
})

async function sendEmail({
  templateId, 
  toEmail, 
  subject,
}) {
  
}

type UserState = "non-active" | "active"

const getUserState = async (): Promise<UserState> => {
  // Implement user state logic here
  return "non-active"
}