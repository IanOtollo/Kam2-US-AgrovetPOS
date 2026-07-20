/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as brands from "../brands.js";
import type * as categories from "../categories.js";
import type * as clearImages from "../clearImages.js";
import type * as customers from "../customers.js";
import type * as expenses from "../expenses.js";
import type * as files from "../files.js";
import type * as getCostPrices from "../getCostPrices.js";
import type * as getMissingImages from "../getMissingImages.js";
import type * as http from "../http.js";
import type * as inspectImages from "../inspectImages.js";
import type * as inventory from "../inventory.js";
import type * as mpesa from "../mpesa.js";
import type * as products from "../products.js";
import type * as purchaseOrders from "../purchaseOrders.js";
import type * as reassignImages from "../reassignImages.js";
import type * as reports from "../reports.js";
import type * as sales from "../sales.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as suppliers from "../suppliers.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  brands: typeof brands;
  categories: typeof categories;
  clearImages: typeof clearImages;
  customers: typeof customers;
  expenses: typeof expenses;
  files: typeof files;
  getCostPrices: typeof getCostPrices;
  getMissingImages: typeof getMissingImages;
  http: typeof http;
  inspectImages: typeof inspectImages;
  inventory: typeof inventory;
  mpesa: typeof mpesa;
  products: typeof products;
  purchaseOrders: typeof purchaseOrders;
  reassignImages: typeof reassignImages;
  reports: typeof reports;
  sales: typeof sales;
  seed: typeof seed;
  settings: typeof settings;
  suppliers: typeof suppliers;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
