import { relations } from 'drizzle-orm';
import { boolean, integer, numeric, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const rates = pgTable('rates', {
  id: serial('id').primaryKey(),
  gold24kSale: integer('gold_24k_sale').notNull(),
  gold24kPurchase: integer('gold_24k_purchase').notNull(),
  gold22kSale: integer('gold_22k_sale').notNull(),
  gold22kPurchase: integer('gold_22k_purchase').notNull(),
  gold18kSale: integer('gold_18k_sale').notNull(),
  gold18kPurchase: integer('gold_18k_purchase').notNull(),
  silverSale: integer('silver_sale').notNull(),
  silverPurchase: integer('silver_purchase').notNull(),
  platinumSale: integer('platinum_sale').notNull(),
  platinumPurchase: integer('platinum_purchase').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const rateHistoryLogs = pgTable('rate_history_logs', {
  id: serial('id').primaryKey(),
  sourceApiResponse: jsonb('source_api_response'),
  gold24kSale: integer('gold_24k_sale').notNull(),
  gold24kPurchase: integer('gold_24k_purchase').notNull(),
  gold22kSale: integer('gold_22k_sale').notNull(),
  gold22kPurchase: integer('gold_22k_purchase').notNull(),
  gold18kSale: integer('gold_18k_sale').notNull(),
  gold18kPurchase: integer('gold_18k_purchase').notNull(),
  silverSale: integer('silver_sale').notNull(),
  silverPurchase: integer('silver_purchase').notNull(),
  platinumSale: integer('platinum_sale').notNull(),
  platinumPurchase: integer('platinum_purchase').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const syncLogs = pgTable('sync_logs', {
  id: serial('id').primaryKey(),
  status: text('status').notNull(), // 'success' or 'error'
  apiResponse: jsonb('api_response'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const calculationSettings = pgTable('calculation_settings', {
  id: serial('id').primaryKey(),
  syncIntervalMinutes: integer('sync_interval_minutes').notNull().default(1),
  silverPurchaseOffset: integer('silver_purchase_offset').notNull().default(5000),
  platinumPurchaseOffset: integer('platinum_purchase_offset').notNull().default(4000),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const globalState = pgTable('global_state', {
  id: serial('id').primaryKey(),
  moduleName: text('module_name').notNull().unique(), // e.g. 'displaySetting', 'promos', 'media', 'branches'
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
