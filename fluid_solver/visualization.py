import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import os

def visualize(history, grid, output_path):
    fig, ax = plt.subplots(figsize=(6, 6))
    
    # Center coordinates
    x = np.linspace(0, 1.0, grid.nx)
    y = np.linspace(0, 1.0, grid.ny)
    X, Y = np.meshgrid(x, y, indexing='ij')
    
    def interpolate_centers(u, v):
        u_c = 0.5 * (u[:-1, :] + u[1:, :])
        v_c = 0.5 * (v[:, :-1] + v[:, 1:])
        return u_c, v_c

    # Calculate global max speed for color scale
    max_speed = 1e-5
    for (u, v, p) in history:
        u_c, v_c = interpolate_centers(u, v)
        speed = np.sqrt(u_c**2 + v_c**2)
        max_speed = max(max_speed, np.max(speed))

    def update(frame):
        ax.clear()
        u, v, p = history[frame]
        u_c, v_c = interpolate_centers(u, v)
        
        speed = np.sqrt(u_c**2 + v_c**2)
        
        # Plot velocity magnitude
        c = ax.pcolormesh(X, Y, speed, cmap='viridis', shading='gouraud', vmin=0, vmax=max_speed)
        
        # Streamlines
        ax.streamplot(X.T, Y.T, u_c.T, v_c.T, color='w', linewidth=0.8, density=1.0)
        
        ax.set_title(f"Lid-Driven Cavity - Frame {frame}")
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.set_aspect('equal')
        return ax

    ani = animation.FuncAnimation(fig, update, frames=len(history), interval=50)
    
    # create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Need ffmpeg for mp4, fallback to pillow if unavailable
    try:
        ani.save(output_path, fps=20, extra_args=['-vcodec', 'libx264'])
    except Exception as e:
        print(f"Warning: Could not save as mp4 ({e}). Trying as gif...")
        gif_path = output_path.replace(".mp4", ".gif")
        ani.save(gif_path, fps=20, writer='pillow')
    
    plt.close()