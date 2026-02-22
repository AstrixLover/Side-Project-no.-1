import { useSimulations } from "@/hooks/use-simulations";
import { CreateSimulationForm } from "@/components/CreateSimulationForm";
import { SimulationCard } from "@/components/SimulationCard";
import { Activity, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: simulations, isLoading } = useSimulations();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Navier-Stokes Engine
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          High-performance 2D Computational Fluid Dynamics solver using MAC grid projection.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Configuration Form */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 self-start">
          <CreateSimulationForm />
        </div>

        {/* Right Column: Simulation History */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/50">
            <Database className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-bold tracking-tight">Recent Runs</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-panel p-5 rounded-2xl h-48">
                  <Skeleton className="h-6 w-1/3 mb-4 bg-white/5" />
                  <Skeleton className="h-16 w-full mb-4 bg-white/5" />
                  <Skeleton className="h-4 w-1/4 bg-white/5" />
                </div>
              ))}
            </div>
          ) : simulations?.length === 0 ? (
            <div className="text-center py-20 px-4 border border-dashed border-border/50 rounded-2xl bg-background/30">
              <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No simulations yet</h3>
              <p className="text-muted-foreground">Configure parameters on the left to start computing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
              {simulations?.map((sim) => (
                <SimulationCard key={sim.id} simulation={sim} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
