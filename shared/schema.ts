import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  website: text("website").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(), // Encrypted
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(), // Encrypted
  type: text("type").notNull(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  amount: decimal("amount").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  paymentSource: text("payment_source").notNull(),
});

export const insertCredentialSchema = createInsertSchema(credentials);
export const insertDocumentSchema = createInsertSchema(documents);
export const insertExpenseSchema = createInsertSchema(expenses);

export const categoryEnum = z.enum([
  "Food",
  "Rent",
  "Shopping",
  "Entertainment",
  "Transport",
  "Utilities",
  "Other"
]);

export const paymentSourceEnum = z.enum([
  "Credit Card",
  "Debit Card",
  "UPI",
  "Cash",
  "Other"
]);

export type InsertCredential = z.infer<typeof insertCredentialSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type Credential = typeof credentials.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Expense = typeof expenses.$inferSelect;