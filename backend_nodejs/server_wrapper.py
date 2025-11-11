#!/usr/bin/env python3
"""
Server Wrapper - Starts and maintains Node.js backend
This wrapper ensures the Node.js backend runs instead of Python backend
"""
import subprocess
import sys
import os
import time
import signal
import atexit

# Path to Node.js backend
NODEJS_BACKEND_DIR = "/app/backend"
NODEJS_INDEX = "index.js"
PORT = 8001

# Process handle
nodejs_process = None

def start_nodejs_backend():
    """Start the Node.js backend"""
    global nodejs_process
    
    print(f"[Wrapper] Starting Node.js backend in {NODEJS_BACKEND_DIR}")
    print(f"[Wrapper] Port: {PORT}")
    
    env = os.environ.copy()
    env['PORT'] = str(PORT)
    
    try:
        nodejs_process = subprocess.Popen(
            ['node', NODEJS_INDEX],
            cwd=NODEJS_BACKEND_DIR,
            env=env,
            stdout=sys.stdout,
            stderr=sys.stderr,
            preexec_fn=os.setsid  # Create new process group
        )
        print(f"[Wrapper] Node.js backend started with PID: {nodejs_process.pid}")
        return nodejs_process
    except Exception as e:
        print(f"[Wrapper] Failed to start Node.js backend: {e}")
        sys.exit(1)

def stop_nodejs_backend():
    """Stop the Node.js backend gracefully"""
    global nodejs_process
    
    if nodejs_process:
        print("[Wrapper] Stopping Node.js backend...")
        try:
            # Send SIGTERM to process group
            os.killpg(os.getpgid(nodejs_process.pid), signal.SIGTERM)
            nodejs_process.wait(timeout=10)
            print("[Wrapper] Node.js backend stopped")
        except subprocess.TimeoutExpired:
            print("[Wrapper] Force killing Node.js backend")
            os.killpg(os.getpgid(nodejs_process.pid), signal.SIGKILL)
        except Exception as e:
            print(f"[Wrapper] Error stopping Node.js backend: {e}")

def signal_handler(signum, frame):
    """Handle termination signals"""
    print(f"[Wrapper] Received signal {signum}, shutting down...")
    stop_nodejs_backend()
    sys.exit(0)

def main():
    """Main function"""
    print("=" * 60)
    print("Node.js Backend Wrapper")
    print("=" * 60)
    
    # Register signal handlers
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)
    
    # Register cleanup on exit
    atexit.register(stop_nodejs_backend)
    
    # Start Node.js backend
    process = start_nodejs_backend()
    
    # Monitor the process
    try:
        while True:
            # Check if process is still running
            if process.poll() is not None:
                print(f"[Wrapper] Node.js backend exited with code {process.returncode}")
                print("[Wrapper] Restarting Node.js backend...")
                time.sleep(2)
                process = start_nodejs_backend()
            
            time.sleep(5)  # Check every 5 seconds
    except KeyboardInterrupt:
        print("[Wrapper] Received keyboard interrupt")
        stop_nodejs_backend()
    except Exception as e:
        print(f"[Wrapper] Error in main loop: {e}")
        stop_nodejs_backend()
        sys.exit(1)

if __name__ == "__main__":
    main()
