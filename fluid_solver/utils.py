import numpy as np

def apply_boundary_conditions(u, v, lid_vel):
    nx, ny = u.shape[0] - 1, v.shape[1] - 1
    
    # Left and right walls (no penetration)
    u[0, :] = 0.0
    u[nx, :] = 0.0
    
    # Bottom wall
    v[:, 0] = 0.0
    u[:, 0] = 0.0 # No slip
    
    # Top wall (Lid driven)
    v[:, ny] = 0.0
    u[:, ny-1] = lid_vel # Lid moves
    
    # For no-slip on left/right v velocity:
    v[0, :] = 0.0
    v[nx-1, :] = 0.0
    
    return u, v
