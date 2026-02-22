import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type RunSimulationRequest } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Helper to log Zod errors
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useSimulations() {
  return useQuery({
    queryKey: [api.simulations.list.path],
    queryFn: async () => {
      const res = await fetch(api.simulations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch simulations");
      const data = await res.json();
      return parseWithLogging(api.simulations.list.responses[200], data, "simulations.list");
    },
    // Poll the list frequently to update overall statuses if any might be running
    refetchInterval: (query) => {
      const hasRunning = query.state.data?.some(s => s.status === 'pending' || s.status === 'running');
      return hasRunning ? 2000 : false;
    }
  });
}

export function useSimulation(id: number) {
  return useQuery({
    queryKey: [api.simulations.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.simulations.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch simulation");
      const data = await res.json();
      return parseWithLogging(api.simulations.get.responses[200], data, `simulations.get:${id}`);
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return (status === 'pending' || status === 'running') ? 2000 : false;
    },
  });
}

export function useRunSimulation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RunSimulationRequest) => {
      const validated = api.simulations.create.input.parse(data);
      const res = await fetch(api.simulations.create.path, {
        method: api.simulations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        let errorMessage = "Failed to start simulation";
        if (res.status === 400) {
          try {
            const error = api.simulations.create.responses[400].parse(await res.json());
            errorMessage = error.message;
          } catch {
            // fallback
          }
        }
        throw new Error(errorMessage);
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.simulations.create.responses[201], responseData, "simulations.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.simulations.list.path] });
      toast({
        title: "Simulation Started",
        description: "Your fluid dynamics simulation has been queued.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to start",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
