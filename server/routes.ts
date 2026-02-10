import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.products.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const products = await storage.getProducts(category);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  // Seed data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getProducts();
  if (existing.length === 0) {
    const leatherSofas = [
      {
        name: "Phantom Leather Sectional",
        description: "A masterclass in darkness and comfort. Premium top-grain black leather with matte finish. British craftsmanship at its finest.",
        price: 350000, // £3,500
        category: "leather",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        material: "Top-grain Leather",
        isNew: true
      },
      {
        name: "Noir Chesterfield",
        description: "Classic British design reimagined in absolute black. Deep button tufting and hand-finished leather.",
        price: 280000, // £2,800
        category: "leather",
        image: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=800&q=80",
        material: "Italian Leather",
        isNew: false
      },
      {
        name: "Eclipse Recliner",
        description: "Modern minimalist recliner in midnight black leather. Designed for the sophisticated London home.",
        price: 150000, // £1,500
        category: "leather",
        image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80",
        material: "Bonded Leather",
        isNew: false
      }
    ];

    const fabricSofas = [
      {
        name: "Shadow Velvet Sofa",
        description: "Plush black velvet sofa that absorbs light and radiates comfort. Hand-tufted in the UK.",
        price: 220000, // £2,200
        category: "fabric",
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
        material: "Premium Velvet",
        isNew: true
      },
      {
        name: "Obsidian Modular",
        description: "Versatile modular fabric sofa system in charcoal black. Perfect for modern urban living.",
        price: 310000, // £3,100
        category: "fabric",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        material: "Woven Fabric",
        isNew: false
      }
    ];

    for (const p of [...leatherSofas, ...fabricSofas]) {
      await storage.createProduct(p);
    }
    console.log("Database seeded with products");
  }
}
