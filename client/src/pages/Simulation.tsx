import { useRoute, Link } from "wouter";
import { useSimulation } from "@/hooks/use-simulations";
import { StatusBadge } from "@/components/StatusBadge";
import { ChevronLeft, PlayCircle, Terminal, Activity, FileWarning, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function SimulationDetails() {
  const [, params] = useRoute("/simulation/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: simulation, isLoading, isError } = useSimulation(id);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm animate-pulse">LOADING SOLVER DATA...</p>
        </div>
      </div>
    );
  }

  if (isError || !simulation) {
    return (
      <div className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="glass-panel p-12 text-center rounded-2xl border-destructive/20 bg-destructive/5">
          <FileWarning className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Simulation Not Found</h2>
          <p className="text-muted-foreground">The requested data could not be located in the database.</p>
        </div>
      </div>
    );
  }

  const { config } = simulation;
  const isRunning = simulation.status === 'running' || simulation.status === 'pending';

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium text-sm">
        <ChevronLeft className="w-4 h-4 mr-1" /> Dashboard
      </Link>

      {/* Header Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
        {/* Glow effect if running */}
        {isRunning && (
          <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
        )}
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold font-mono tracking-tighter">
              SIM-{simulation.id.toString().padStart(4, '0')}
            </h1>
            <StatusBadge status={simulation.status} className="text-sm px-3 py-1" />
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Initialized {simulation.createdAt ? format(new Date(simulation.createdAt), 'MMM d, yyyy • HH:mm:ss') : 'Unknown'}
          </p>
        </div>

        {/* Config Summary Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm relative z-10 bg-background/50 p-4 rounded-xl border border-border/50">
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">Resolution</span> <span className="font-mono">{config.nx}×{config.ny}</span></div>
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">Reynolds</span> <span className="font-mono text-primary">{config.reynoldsNumber}</span></div>
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">Time Steps</span> <span className="font-mono">{config.steps}</span></div>
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">Delta t</span> <span className="font-mono">{config.dt}</span></div>
          <div className="flex justify-between gap-4 col-span-2 pt-1 mt-1 border-t border-border/50">
            <span className="text-muted-foreground">Lid Velocity</span> <span className="font-mono text-accent">{config.lidVelocity.toFixed(2)} m/s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Visualization */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" /> Flow Visualization
          </h3>
          
          <div className="glass-panel rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden bg-black/40 border-border/80">
            {simulation.status === 'completed' && simulation.outputVideoUrl ? (
              <video 
                src={simulation.outputVideoUrl} 
                autoPlay 
                loop 
                muted 
                controls 
                className="w-full h-full object-contain"
              />
            ) : isRunning ? (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="font-mono text-primary animate-pulse">Solving Equations...</p>
                <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">This may take a moment depending on grid resolution and step count.</p>
              </div>
            ) : simulation.status === 'failed' ? (
              <div className="text-center text-destructive">
                <FileWarning className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-mono font-bold">Solver Diverged</p>
                <p className="text-xs opacity-70 mt-1">Check diagnostics for details</p>
              </div>
            ) : (
              <p className="text-muted-foreground font-mono text-sm">No visual output available</p>
            )}
          </div>
        </div>

        {/* Right Column: Diagnostics */}
        <div className="space-y-4 flex flex-col h-full">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Terminal className="w-5 h-5 text-muted-foreground" /> Solver Diagnostics
          </h3>
          
          <div className="glass-panel rounded-2xl flex-1 p-4 bg-black/60 font-mono text-xs overflow-hidden relative">
            
            {/* Terminal Header fake buttons */}
            <div className="flex gap-2 absolute top-4 left-4">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>

            <div className="pt-8 h-full overflow-y-auto scrollbar-hide">
              {simulation.diagnostics ? (
                <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                  {simulation.diagnostics}
                </pre>
              ) : isRunning ? (
                <div className="text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-4 bg-primary animate-pulse inline-block" />
                  Awaiting solver output streams...
                </div>
              ) : (
                <p className="text-gray-600 italic">No diagnostic logs recorded for this run.</p>
              )}
            </div>
            
            {/* Fade out bottom text */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>
        </div>

      </div>
    </div>
  );
}
