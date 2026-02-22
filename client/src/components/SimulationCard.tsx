import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Waves, ArrowRight, Grid3X3, Wind } from "lucide-react";
import { type Simulation } from "@shared/schema";
import { StatusBadge } from "./StatusBadge";

export function SimulationCard({ simulation }: { simulation: Simulation }) {
  const { config } = simulation;
  
  return (
    <Link href={`/simulation/${simulation.id}`} className="block group">
      <div className="glass-panel p-5 rounded-2xl transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10 hover:-translate-y-1 relative overflow-hidden">
        
        {/* Subtle background decoration */}
        <div className="absolute -right-12 -top-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
          <Waves className="w-32 h-32" />
        </div>

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 className="font-mono text-lg font-bold text-foreground flex items-center gap-2">
              SIM-{simulation.id.toString().padStart(4, '0')}
            </h3>
            {simulation.createdAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(simulation.createdAt), { addSuffix: true })}
              </p>
            )}
          </div>
          <StatusBadge status={simulation.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
          <div className="bg-background/50 rounded-lg p-2.5 border border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Grid3X3 className="w-3 h-3" /> Grid Size
            </div>
            <div className="font-mono text-sm">{config.nx} × {config.ny}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-2.5 border border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Wind className="w-3 h-3" /> Reynolds
            </div>
            <div className="font-mono text-sm">{config.reynoldsNumber}</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm font-medium text-primary opacity-80 group-hover:opacity-100 transition-opacity relative z-10">
          <span>View Analysis</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
