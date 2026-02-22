2D Navier-Stokes Fluid Simulation Engine

A mathematically rigorous 2D incompressible Navier-Stokes solver built from scratch with a modern web interface for configuration and visualization.

Features

CFD Engine: Written in Python using a staggered MAC grid and the Projection Method.
Numerical Solver: Implements explicit time-stepping for advection-diffusion and a pressure Poisson solver.
Web Interface: React-based dashboard to configure Reynolds number, grid resolution ($N_x, N_y$), and boundary conditions.
Visualization: Real-time diagnostics and automated MP4/GIF animation generation of velocity fields and streamlines.
Prerequisites

Before running the project, ensure you have the following installed:

Node.js (v18 or higher)
Python (v3.10 or higher)
PostgreSQL (for data persistence)
FFmpeg (optional, required for MP4 video generation; falls back to GIF if not found)
Setup

Install Node.js Dependencies:
npm install
Install Python Dependencies:
pip install numpy scipy matplotlib
Database Configuration: Ensure you have a PostgreSQL database running and set the DATABASE_URL environment variable:
export DATABASE_URL=postgres://user:password@localhost:5432/dbname
Initialize Database Schema:
npm run db:push
Running the App

Start both the Express backend and Vite frontend in development mode:

npm run dev
The application will be available at http://localhost:5000.

Project Structure

fluid_solver/: Python CFD engine core.
main.py: Entry point for the solver.
solver.py: Navier-Stokes projection method implementation.
pressure.py: Poisson equation solver.
grid.py: MAC grid definition.
server/: Node.js/Express backend for orchestration.
client/: React/Vite frontend dashboard.
shared/: Shared TypeScript schemas and API route definitions.
Mathematical Details

The engine solves the 2D incompressible Navier-Stokes equations:

Continuity: $\nabla \cdot \mathbf{u} = 0$
Momentum: $\frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla)\mathbf{u} = -\frac{1}{\rho}\nabla p + \nu \nabla^2 \mathbf{u} + \mathbf{f}$
The solver uses a staggered grid where velocity components are defined on cell faces and pressure is defined at cell centers to prevent checkerboard pressure oscillations.
