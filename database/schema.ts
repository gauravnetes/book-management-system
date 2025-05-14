
import {
  uuid,
  integer,
  text,
  pgTable,
  pgEnum,
  date,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// generate postgres enum types like: 
// CREATE TYPE status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

export const STATUS_ENUM = pgEnum("status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);
export const BORROW_STATUS_ENUM = pgEnum("borrow_status", [
  "BORROWED",
  "RETURNED",
]);

// uuid => Universally Unique Identifier
// defaultNow => current date 
// notNull => required field 
export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  universityId: integer("university_id").notNull().unique(),
  password: text("password").notNull(),
  universityCard: text("university_card").notNull(),
  status: STATUS_ENUM("status").default("PENDING"),
  role: ROLE_ENUM("role").default("USER"),
  lastActivityDate: date("last_activity_date").defaultNow(),
  borrowStatus: BORROW_STATUS_ENUM("borrow_status").default("BORROWED"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});
