import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Since the user asked "add database to it" but this is a Jewellery Rate application,
// We should perhaps store rate history.
export const rateHistory = pgTable('rate_history', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(),
  gold24k: integer('gold24k').notNull(),
  gold22k: integer('gold22k').notNull(),
  gold18k: integer('gold18k').notNull(),
  silver: integer('silver').notNull(),
  platinum: integer('platinum').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
