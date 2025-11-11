#!/usr/bin/env python3
"""
Backend Proxy - Runs Node.js backend and provides passthrough
This ensures the Node.js backend is used instead of Python
"""
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse
import subprocess
import httpx
import os
import signal
import atexit
import asyncio

# Configuration
NODEJS_BACKEND_DIR = "/app/backend"
NODEJS_PORT = 8002  # Run Node.js on different port
PROXY_PORT = 8001   # This Python app listens on 8001

# Global process handle
nodejs_process = None

def start_nodejs():
    """Start Node.js backend"""
    global nodejs_process
    
    print(f"🚀 Starting Node.js backend on port {NODEJS_PORT}")
    
    env = os.environ.copy()
    env['PORT'] = str(NODEJS_PORT)
    
    try:
        nodejs_process = subprocess.Popen(
            ['node', 'index.js'],
            cwd=NODEJS_BACKEND_DIR,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            preexec_fn=os.setsid
        )
        print(f"✓ Node.js backend started (PID: {nodejs_process.pid})")
    except Exception as e:
        print(f"✗ Failed to start Node.js: {e}")

def stop_nodejs():
    """Stop Node.js backend"""
    global nodejs_process
    if nodejs_process:
        print("Stopping Node.js backend...")
        try:
            os.killpg(os.getpgid(nodejs_process.pid), signal.SIGTERM)
            nodejs_process.wait(timeout=5)
        except:
            try:
                os.killpg(os.getpgid(nodejs_process.pid), signal.SIGKILL)
            except:
                pass

# Register cleanup
atexit.register(stop_nodejs)

# Start Node.js on module load
start_nodejs()

# Create FastAPI proxy app
app = FastAPI(title="Backend Proxy")

# HTTP client
client = httpx.AsyncClient(timeout=30.0)

@app.on_event("shutdown")
async def shutdown():
    await client.aclose()
    stop_nodejs()

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy(request: Request, path: str):
    """Proxy all requests to Node.js backend"""
    url = f"http://localhost:{NODEJS_PORT}/{path}"
    
    # Forward query parameters
    if request.url.query:
        url = f"{url}?{request.url.query}"
    
    # Prepare headers
    headers = dict(request.headers)
    headers.pop("host", None)
    
    # Get request body
    body = await request.body()
    
    try:
        # Forward request to Node.js
        response = await client.request(
            method=request.method,
            url=url,
            headers=headers,
            content=body,
        )
        
        # Return response
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers),
        )
    except httpx.ConnectError:
        return Response(
            content='{"error": "Node.js backend not available"}',
            status_code=503,
            media_type="application/json"
        )
    except Exception as e:
        return Response(
            content=f'{{"error": "{str(e)}"}}',
            status_code=500,
            media_type="application/json"
        )
