import argparse
import sys
from grid import Grid
from solver import solve
from visualization import visualize

def main():
    parser = argparse.ArgumentParser(description="2D Navier-Stokes Fluid Simulation")
    parser.add_argument("--nx", type=int, default=50)
    parser.add_argument("--ny", type=int, default=50)
    parser.add_argument("--re", type=float, default=100.0)
    parser.add_argument("--steps", type=int, default=500)
    parser.add_argument("--dt", type=float, default=0.01)
    parser.add_argument("--lid_vel", type=float, default=1.0)
    parser.add_argument("--output", type=str, default="output.mp4")

    args = parser.parse_args()

    Lx, Ly = 1.0, 1.0

    print(f"Initializing Grid: {args.nx}x{args.ny}, Re={args.re}, steps={args.steps}")
    grid = Grid(args.nx, args.ny, Lx, Ly)

    print("Starting simulation...")
    history = solve(grid, args.steps, args.dt, args.re, args.lid_vel)

    print(f"Generating animation at {args.output}...")
    visualize(history, grid, args.output)
    
    print("Done.")

if __name__ == "__main__":
    main()