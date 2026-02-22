import { pgTable, serial, text, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const simulations = pgTable("simulations", {
  id: serial("id").primaryKey(),
  status: text("status").notNull().default("pending"), // pending, running, completed, failed
  config: json("config").$type<{
    nx: number;
    ny: number;
    reynoldsNumber: number;
    steps: number;
    dt: number;
    lidVelocity: number;
  }>().notNull(),
  outputVideoUrl: text("output_video_url"),
  diagnostics: text("diagnostics"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({ 
  id: true,
  createdAt: true,
  outputVideoUrl: true,
  diagnostics: true
});

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;

export const runSimulationRequestSchema = z.object({
  nx: z.number().int().min(10).max(200).default(50),
  ny: z.number().int().min(10).max(200).default(50),
  reynoldsNumber: z.number().min(1).max(10000).default(100),
  steps: z.number().int().min(10).max(5000).default(500),
  dt: z.number().min(0.0001).max(0.1).default(0.01),
  lidVelocity: z.number().min(-10).max(10).default(1.0),
});
export type RunSimulationRequest = z.infer<typeof runSimulationRequestSchema>;
