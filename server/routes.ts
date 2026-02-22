import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.simulations.list.path, async (req, res) => {
    const sims = await storage.getSimulations();
    res.json(sims);
  });

  app.get(api.simulations.get.path, async (req, res) => {
    const sim = await storage.getSimulation(Number(req.params.id));
    if (!sim) {
      return res.status(404).json({ message: 'Simulation not found' });
    }
    res.json(sim);
  });

  app.post(api.simulations.create.path, async (req, res) => {
    try {
      const input = api.simulations.create.input.parse(req.body);
      const sim = await storage.createSimulation({
        status: "pending",
        config: input,
      });

      // Start the simulation in the background
      runPythonSimulation(sim.id, input).catch(console.error);

      res.status(201).json(sim);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}

async function runPythonSimulation(id: number, config: any) {
  try {
    await storage.updateSimulation(id, { status: "running" });

    // Make sure output dir exists
    const outputDir = path.join(process.cwd(), "client", "public", "videos");
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `sim_${id}.mp4`);

    const args = [
      "fluid_solver/main.py",
      "--nx", config.nx.toString(),
      "--ny", config.ny.toString(),
      "--re", config.reynoldsNumber.toString(),
      "--steps", config.steps.toString(),
      "--dt", config.dt.toString(),
      "--lid_vel", config.lidVelocity.toString(),
      "--output", outputPath
    ];

    const child = spawn("python", args);

    let outputLog = "";

    child.stdout.on("data", (data) => {
      outputLog += data.toString();
    });

    child.stderr.on("data", (data) => {
      outputLog += data.toString();
    });

    child.on("close", async (code) => {
      if (code === 0) {
        await storage.updateSimulation(id, { 
          status: "completed", 
          diagnostics: outputLog,
          outputVideoUrl: `/videos/sim_${id}.mp4`
        });
      } else {
        await storage.updateSimulation(id, { 
          status: "failed", 
          diagnostics: `Process exited with code ${code}\n\n${outputLog}` 
        });
      }
    });

  } catch (error: any) {
    await storage.updateSimulation(id, { 
      status: "failed", 
      diagnostics: error.message || String(error)
    });
  }
}
