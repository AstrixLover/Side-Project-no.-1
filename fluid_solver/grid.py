import numpy as np

class Grid:
    def __init__(self, nx: int, ny: int, Lx: float, Ly: float):
        self.nx = nx
        self.ny = ny
        self.dx = Lx / nx
        self.dy = Ly / ny
        
        # Staggered MAC grid:
        # u velocity on vertical edges (nx+1, ny)
        self.u = np.zeros((nx + 1, ny))
        # v velocity on horizontal edges (nx, ny+1)
        self.v = np.zeros((nx, ny + 1))
        # pressure at cell centers (nx, ny)
        self.p = np.zeros((nx, ny))