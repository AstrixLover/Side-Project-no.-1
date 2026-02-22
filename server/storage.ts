import { db } from "./db";
import {
  simulations,
  type InsertSimulation,
  type Simulation,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getSimulations(): Promise<Simulation[]>;
  getSimulation(id: number): Promise<Simulation | undefined>;
  createSimulation(sim: InsertSimulation): Promise<Simulation>;
  updateSimulation(id: number, updates: Partial<Simulation>): Promise<Simulation>;
}

export class DatabaseStorage implements IStorage {
  async getSimulations(): Promise<Simulation[]> {
    return await db.select().from(simulations).orderBy(desc(simulations.id));
  }

  async getSimulation(id: number): Promise<Simulation | undefined> {
    const [sim] = await db.select().from(simulations).where(eq(simulations.id, id));
    return sim;
  }

  async createSimulation(insertSim: InsertSimulation): Promise<Simulation> {
    const [sim] = await db.insert(simulations).values(insertSim).returning();
    return sim;
  }

  async updateSimulation(id: number, updates: Partial<Simulation>): Promise<Simulation> {
    const [updated] = await db.update(simulations)
      .set(updates)
      .where(eq(simulations.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
