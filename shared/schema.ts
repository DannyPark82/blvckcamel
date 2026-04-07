import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in cents
  category: text("category").notNull(), // 'leather' or 'fabric'
  image: text("image").notNull(),
  images: text("images").array().default([]), // Array of additional images
  content: text("content"), // Product detailed description/body
  material: text("material").notNull(),
  isNew: boolean("is_new").default(false),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = Partial<InsertProduct>;

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'hero', 'about'
  content: jsonb("content").notNull(), // Flexible structure: { image: string, title: string, ... }
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({ id: true });
export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
