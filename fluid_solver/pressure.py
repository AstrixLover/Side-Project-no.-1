import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla

def build_poisson_matrix(nx, ny, dx, dy):
    N = nx * ny
    A = sp.dok_matrix((N, N), dtype=np.float64)
    
    idx = lambda i, j: i * ny + j
    
    idx2 = 1.0 / (dx**2)
    idy2 = 1.0 / (dy**2)
    
    for i in range(nx):
        for j in range(ny):
            row = idx(i, j)
            diag = 0.0
            
            if i > 0:
                A[row, idx(i-1, j)] = idx2
                diag -= idx2
            if i < nx - 1:
                A[row, idx(i+1, j)] = idx2
                diag -= idx2
            if j > 0:
                A[row, idx(i, j-1)] = idy2
                diag -= idy2
            if j < ny - 1:
                A[row, idx(i, j+1)] = idy2
                diag -= idy2
                
            A[row, row] = diag
            
    # Fix null space by anchoring pressure at one point
    A[0, 0] = 1.0
    for j in range(1, N):
        A[0, j] = 0.0
        
    return A.tocsr()

_poisson_A = None
_poisson_solver = None

def solve_pressure(p_guess, div, dx, dy, dt):
    global _poisson_A, _poisson_solver
    nx, ny = div.shape
    
    if _poisson_A is None or _poisson_A.shape[0] != nx*ny:
        _poisson_A = build_poisson_matrix(nx, ny, dx, dy)
        _poisson_solver = spla.factorized(_poisson_A)
        
    rhs = (div / dt).flatten()
    rhs[0] = 0.0 # Match null space fix
    
    p_flat = _poisson_solver(rhs)
    return p_flat.reshape((nx, ny))
