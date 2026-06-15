import { relations } from 'drizzle-orm';
import { boolean, integer, numeric, pgTable, serial, text, timestamp, jsonb, doublePrecision } from 'drizzle-orm/pg-core';

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
  gold24kPurMult: doublePrecision('gold24k_pur_mult').notNull().default(0.985),
  gold22kSaleMult: doublePrecision('gold22k_sale_mult').notNull().default(0.920),
  gold22kPurMult: doublePrecision('gold22k_pur_mult').notNull().default(0.900),
  gold18kSaleMult: doublePrecision('gold18k_sale_mult').notNull().default(0.860),
  gold18kPurMult: doublePrecision('gold18k_pur_mult').notNull().default(0.800),
  enableAutoSync: boolean('enable_auto_sync').notNull().default(true),
  storeRatesInDb: boolean('store_rates_in_db').notNull().default(true),
  useManualRates: boolean('use_manual_rates').notNull().default(false),
  manualGold24k: integer('manual_gold24k').notNull().default(150000),
  manualSilver: integer('manual_silver').notNull().default(250000),
  manualPlatinum: integer('manual_platinum').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const globalState = pgTable('global_state', {
  id: serial('id').primaryKey(),
  moduleName: text('module_name').notNull().unique(), // e.g. 'displaySetting', 'promos', 'media', 'branches'
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
