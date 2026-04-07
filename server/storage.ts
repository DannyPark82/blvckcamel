import { db } from "./db";
import {
  products,
  siteContent,
  type Product,
  type InsertProduct,
  type SiteContent,
  type InsertSiteContent,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProducts(category?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(insertProduct: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;

  getSiteContent(key: string): Promise<SiteContent | undefined>;
  updateSiteContent(key: string, content: any): Promise<SiteContent>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(category?: string): Promise<Product[]> {
    if (category) {
      return await db!.select().from(products).where(eq(products.category, category));
    }
    return await db!.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db!.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db!.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db!
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async getSiteContent(key: string): Promise<SiteContent | undefined> {
    const [content] = await db!.select().from(siteContent).where(eq(siteContent.key, key));
    return content;
  }

  async updateSiteContent(key: string, content: any): Promise<SiteContent> {
    const [existing] = await db!.select().from(siteContent).where(eq(siteContent.key, key));

    if (existing) {
      const [updated] = await db!
        .update(siteContent)
        .set({ content })
        .where(eq(siteContent.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db!
        .insert(siteContent)
        .values({ key, content })
        .returning();
      return created;
    }
  }
}

export class MemStorage implements IStorage {
  private products: Product[] = [];
  private siteContent: Map<string, SiteContent> = new Map();
  private currentId = 1;
  private currentContentId = 1;

  async getProducts(category?: string): Promise<Product[]> {
    if (category) {
      return this.products.filter((p) => p.category === category);
    }
    return this.products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.find((p) => p.id === id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = {
      ...insertProduct,
      id: this.currentId++,
      isNew: insertProduct.isNew ?? false,
      images: insertProduct.images ?? [],
      content: insertProduct.content ?? null,
    };
    this.products.push(product);
    return product;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    this.products[index] = { ...this.products[index], ...product };
    return this.products[index];
  }

  async getSiteContent(key: string): Promise<SiteContent | undefined> {
    return this.siteContent.get(key);
  }

  async updateSiteContent(key: string, content: any): Promise<SiteContent> {
    const existing = this.siteContent.get(key);
    if (existing) {
      const updated = { ...existing, content };
      this.siteContent.set(key, updated);
      return updated;
    } else {
      const created = { id: this.currentContentId++, key, content };
      this.siteContent.set(key, created);
      return created;
    }
  }
}

export const storage = db ? new DatabaseStorage() : new MemStorage();
