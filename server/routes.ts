import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertCredentialSchema,
  insertDocumentSchema,
  insertExpenseSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Credentials routes
  app.get("/api/credentials", async (_req, res) => {
    const credentials = await storage.getCredentials();
    res.json(credentials);
  });

  app.post("/api/credentials", async (req, res) => {
    try {
      const data = insertCredentialSchema.parse(req.body);
      const credential = await storage.createCredential(data);
      res.json(credential);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.patch("/api/credentials/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = insertCredentialSchema.partial().parse(req.body);
      const credential = await storage.updateCredential(id, data);
      res.json(credential);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.delete("/api/credentials/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteCredential(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Documents routes
  app.get("/api/documents", async (_req, res) => {
    const documents = await storage.getDocuments();
    res.json(documents);
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const data = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(data);
      res.json(document);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteDocument(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Expenses routes
  app.get("/api/expenses", async (_req, res) => {
    const expenses = await storage.getExpenses();
    res.json(expenses);
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const data = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(data);
      res.json(expense);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.patch("/api/expenses/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = insertExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(id, data);
      res.json(expense);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteExpense(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}