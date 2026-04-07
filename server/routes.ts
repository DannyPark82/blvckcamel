import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import { insertProductSchema } from "@shared/schema";
import { logBuffer, log } from "./index";
import path from "path";
import fs from "fs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Middleware to check if user is admin (simple session/cookie check could be better but sticking to simple requirement)
  const requireAdmin = (req: any, res: any, next: any) => {
    // In a real app use sessions. checking a header or query for now since we have no session store setup in this memory mode easily without more boilerplate
    // but the user asked for a login page.
    // Let's implement a simple in-memory session or just check a custom header set by the frontend after login.
    // Better: Express-session was in package.json. Let's use it if configured, or just trust the client sends a token.
    // For simplicity in this "run locally" memory mode, we'll assume the client sends an 'x-admin-token' header.
    const token = req.headers['x-admin-token'];
    if (token === 'admin-secret-token-1234') {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };

  app.get('/api/admin/logs', requireAdmin, (_req, res) => {
    res.json(logBuffer);
  });

  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin1234') {
      res.json({ token: 'admin-secret-token-1234' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'client', 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir)
      },
      filename: function (req, file, cb) {
        // Fix encoding for Korean filenames if necessary, or just use safe unique names
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  app.post('/api/upload', requireAdmin, (req, res, next) => {
    log(`Starting upload for ${req.ip}`);
    const uploader = upload.single('file');

    uploader(req, res, (err: any) => {
      if (err) {
        console.error("Multer upload error:", err);
        return res.status(400).json({ message: "Upload failed", error: err.message });
      }

      if (!req.file) {
        log("No file in request");
        return res.status(400).json({ message: 'No file uploaded' });
      }

      log(`File uploaded: ${req.file.filename}`);
      res.json({ url: `/uploads/${req.file.filename}` });
    });
  });

  app.post('/api/products', requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (e) {
      res.status(400).json({ message: 'Invalid product data', error: e });
    }
  });

  app.put('/api/products/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedProduct = await storage.updateProduct(id, req.body);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updatedProduct);
    } catch (e) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.get('/api/content/:key', async (req, res) => {
    try {
      const content = await storage.getSiteContent(req.params.key);
      res.json(content || {});
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post('/api/content/:key', requireAdmin, async (req, res) => {
    try {
      const content = await storage.updateSiteContent(req.params.key, req.body);
      res.json(content);
    } catch (e) {
      res.status(500).json({ message: "Failed to update content" });
    }
  });

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
        isNew: true,
        content: "A masterclass in darkness and comfort.",
      },
      {
        name: "Noir Chesterfield",
        description: "Classic British design reimagined in absolute black. Deep button tufting and hand-finished leather.",
        price: 280000, // £2,800
        category: "leather",
        image: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=800&q=80",
        material: "Italian Leather",
        isNew: false,
        content: "Classic British design reimagined.",
      },
      {
        name: "Eclipse Recliner",
        description: "Modern minimalist recliner in midnight black leather. Designed for the sophisticated London home.",
        price: 150000, // £1,500
        category: "leather",
        image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80",
        material: "Bonded Leather",
        isNew: false,
        content: "Modern minimalist recliner.",
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
        isNew: true,
        content: "Plush black velvet sofa.",
      },
      {
        name: "Obsidian Modular",
        description: "Versatile modular fabric sofa system in charcoal black. Perfect for modern urban living.",
        price: 310000, // £3,100
        category: "fabric",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        material: "Woven Fabric",
        isNew: false,
        content: "Versatile modular fabric sofa system.",
      }
    ];

    for (const p of [...leatherSofas, ...fabricSofas]) {
      await storage.createProduct(p);
    }
    console.log("Database seeded with products");
  }
}
