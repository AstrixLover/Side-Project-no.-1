import numpy as np
from pressure import solve_pressure
from utils import apply_boundary_conditions

def advection_diffusion(u, v, dx, dy, dt, nu):
    nx, ny = u.shape[0] - 1, u.shape[1]
    
    u_star = u.copy()
    v_star = v.copy()
    
    # Internal u-points
    for i in range(1, nx):
        for j in range(1, ny - 1):
            u_c = u[i, j]
            v_c = 0.25 * (v[i-1, j] + v[i, j] + v[i-1, j+1] + v[i, j+1])
            
            du_dx = (u[i+1, j] - u[i-1, j]) / (2 * dx)
            du_dy = (u[i, j+1] - u[i, j-1]) / (2 * dy)
            
            d2u_dx2 = (u[i+1, j] - 2*u[i, j] + u[i-1, j]) / (dx**2)
            d2u_dy2 = (u[i, j+1] - 2*u[i, j] + u[i, j-1]) / (dy**2)
            
            adv = -(u_c * du_dx + v_c * du_dy)
            diff = nu * (d2u_dx2 + d2u_dy2)
            
            u_star[i, j] = u[i, j] + dt * (adv + diff)

    # Internal v-points
    for i in range(1, nx - 1):
        for j in range(1, ny):
            v_c = v[i, j]
            u_c = 0.25 * (u[i, j-1] + u[i+1, j-1] + u[i, j] + u[i+1, j])
            
            dv_dx = (v[i+1, j] - v[i-1, j]) / (2 * dx)
            dv_dy = (v[i, j+1] - v[i, j-1]) / (2 * dy)
            
            d2v_dx2 = (v[i+1, j] - 2*v[i, j] + v[i-1, j]) / (dx**2)
            d2v_dy2 = (v[i, j+1] - 2*v[i, j] + v[i, j-1]) / (dy**2)
            
            adv = -(u_c * dv_dx + v_c * dv_dy)
            diff = nu * (d2v_dx2 + d2v_dy2)
            
            v_star[i, j] = v[i, j] + dt * (adv + diff)

    return u_star, v_star

def compute_divergence(u, v, dx, dy):
    nx, ny = u.shape[0] - 1, v.shape[1] - 1
    div = np.zeros((nx, ny))
    for i in range(nx):
        for j in range(ny):
            div[i, j] = (u[i+1, j] - u[i, j]) / dx + (v[i, j+1] - v[i, j]) / dy
    return div

def project(u_star, v_star, p, dx, dy, dt):
    nx, ny = p.shape
    u_new = u_star.copy()
    v_new = v_star.copy()
    
    for i in range(1, nx):
        for j in range(ny):
            u_new[i, j] = u_star[i, j] - (dt / dx) * (p[i, j] - p[i-1, j])
            
    for i in range(nx):
        for j in range(1, ny):
            v_new[i, j] = v_star[i, j] - (dt / dy) * (p[i, j] - p[i, j-1])
            
    return u_new, v_new

def solve(grid, steps, dt, Re, lid_vel):
    nu = 1.0 / Re
    history = []
    
    u = grid.u
    v = grid.v
    p = grid.p
    
    print(f"nu={nu}, dx={grid.dx}, dy={grid.dy}")
    
    # CFL check for diffusion limit: dt <= 0.25 * min(dx^2, dy^2) / nu
    diff_limit = 0.25 * min(grid.dx**2, grid.dy**2) / nu
    if dt > diff_limit:
        print(f"WARNING: dt ({dt}) is larger than diffusion stability limit ({diff_limit}).")

    for step in range(steps):
        # 1. Advection-Diffusion
        u_star, v_star = advection_diffusion(u, v, grid.dx, grid.dy, dt, nu)
        
        # Boundary conditions on u_star, v_star
        u_star, v_star = apply_boundary_conditions(u_star, v_star, lid_vel)
        
        # 2. Divergence
        div = compute_divergence(u_star, v_star, grid.dx, grid.dy)
        
        # 3. Pressure Poisson
        p = solve_pressure(p, div, grid.dx, grid.dy, dt)
        
        # 4. Projection
        u, v = project(u_star, v_star, p, grid.dx, grid.dy, dt)
        
        # Enforce boundaries again
        u, v = apply_boundary_conditions(u, v, lid_vel)
        
        if step % max(1, steps // 50) == 0:
            div_mag = np.max(np.abs(compute_divergence(u, v, grid.dx, grid.dy)))
            print(f"Step {step:4d}/{steps} - Max Div: {div_mag:.6e}")
            history.append((u.copy(), v.copy(), p.copy()))
            
    return history
