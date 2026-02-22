import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { runSimulationRequestSchema, type RunSimulationRequest } from "@shared/schema";
import { useRunSimulation } from "@/hooks/use-simulations";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Play, Settings2 } from "lucide-react";

export function CreateSimulationForm() {
  const { mutate: runSimulation, isPending } = useRunSimulation();

  const form = useForm<RunSimulationRequest>({
    resolver: zodResolver(runSimulationRequestSchema),
    defaultValues: {
      nx: 50,
      ny: 50,
      reynoldsNumber: 100,
      steps: 500,
      dt: 0.01,
      lidVelocity: 1.0,
    },
  });

  function onSubmit(data: RunSimulationRequest) {
    runSimulation(data);
  }

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold tracking-tight">Solver Configuration</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nx"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-muted-foreground">Grid X Resolution</FormLabel>
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">Nx: {field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={10} max={200} step={10}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ny"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-muted-foreground">Grid Y Resolution</FormLabel>
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">Ny: {field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={10} max={200} step={10}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="reynoldsNumber"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-muted-foreground">Reynolds Number (Re)</FormLabel>
                  <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">Re: {field.value}</span>
                </div>
                <FormControl>
                  <div className="flex gap-4">
                    <Slider
                      min={1} max={10000} step={10}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="flex-1 py-2"
                    />
                    <Input 
                      type="number" 
                      className="w-24 font-mono text-right bg-background/50" 
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </div>
                </FormControl>
                <p className="text-[10px] text-muted-foreground mt-1">Higher Re values simulate less viscous (more turbulent) fluids.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Time Steps</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      className="font-mono bg-background/50" 
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Time Delta (dt)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.001"
                      className="font-mono bg-background/50" 
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="lidVelocity"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-muted-foreground">Top Lid Velocity (u_top)</FormLabel>
                  <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">U: {field.value.toFixed(2)}</span>
                </div>
                <FormControl>
                  <div className="flex gap-4">
                    <Slider
                      min={-10} max={10} step={0.1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="flex-1 py-2"
                    />
                     <Input 
                      type="number" 
                      step="0.1"
                      className="w-24 font-mono text-right bg-background/50" 
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Initializing Grid...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2 fill-current" />
                Compute Simulation
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
