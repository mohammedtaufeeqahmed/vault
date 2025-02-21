import type {
  Credential,
  InsertCredential,
  Document,
  InsertDocument,
  Expense,
  InsertExpense
} from "@shared/schema";

export interface IStorage {
  // Credentials
  getCredentials(): Promise<Credential[]>;
  createCredential(credential: InsertCredential): Promise<Credential>;
  updateCredential(id: number, credential: Partial<InsertCredential>): Promise<Credential>;
  deleteCredential(id: number): Promise<void>;

  // Documents
  getDocuments(): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<void>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense>;
  deleteExpense(id: number): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private credentials: Credential[] = [];
  private documents: Document[] = [];
  private expenses: Expense[] = [];
  private nextId = 1;

  private getNextId(): number {
    return this.nextId++;
  }

  // Credentials
  async getCredentials(): Promise<Credential[]> {
    return this.credentials;
  }

  async createCredential(insertCredential: InsertCredential): Promise<Credential> {
    const id = this.getNextId();
    const credential = { ...insertCredential, id };
    this.credentials.push(credential);
    return credential;
  }

  async updateCredential(id: number, update: Partial<InsertCredential>): Promise<Credential> {
    const index = this.credentials.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error("Credential not found");
    }

    const updated = { ...this.credentials[index], ...update };
    this.credentials[index] = updated;
    return updated;
  }

  async deleteCredential(id: number): Promise<void> {
    const index = this.credentials.findIndex(c => c.id === id);
    if (index !== -1) {
      this.credentials.splice(index, 1);
    }
  }

  // Documents
  async getDocuments(): Promise<Document[]> {
    return this.documents;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.getNextId();
    const document = { ...insertDocument, id };
    this.documents.push(document);
    return document;
  }

  async deleteDocument(id: number): Promise<void> {
    const index = this.documents.findIndex(d => d.id === id);
    if (index !== -1) {
      this.documents.splice(index, 1);
    }
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return this.expenses;
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.getNextId();
    const expense = { ...insertExpense, id };
    this.expenses.push(expense);
    return expense;
  }

  async updateExpense(id: number, update: Partial<InsertExpense>): Promise<Expense> {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error("Expense not found");
    }

    const updated = { ...this.expenses[index], ...update };
    this.expenses[index] = updated;
    return updated;
  }

  async deleteExpense(id: number): Promise<void> {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      this.expenses.splice(index, 1);
    }
  }
}

// Export an instance of MemStorage
export const storage = new MemStorage();