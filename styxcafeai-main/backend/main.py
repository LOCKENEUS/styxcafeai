from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

# Import routers
from routes import auth_router, user_router, admin_router, superadmin_router, superadmin_auth_router

# MongoDB connection
mongo_client = None
database = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global mongo_client, database
    DB_URL = os.getenv("DB_URL")
    if not DB_URL:
        raise ValueError("DB_URL environment variable is required")
    
    mongo_client = AsyncIOMotorClient(DB_URL)
    database = mongo_client.get_database()
    app.state.db = database
    print(f"✓ Connected to MongoDB")
    
    yield
    
    # Shutdown
    mongo_client.close()
    print("✓ Closed MongoDB connection")

# Create FastAPI app
app = FastAPI(
    title="Styx Cafe API",
    description="FastAPI backend for Styx Cafe booking platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
allowed_origins = [
    # Local development URLs
    "http://localhost:3000",  # Customer Website
    "http://localhost:3001",  # Admin Panel
    "http://localhost:3002",  # Additional frontend
    "http://localhost:5173",  # Vite dev server
    "http://localhost:8001",  # Backend
    os.getenv("CLIENT_URL"),  # Production frontend
    os.getenv("ADMIN_URL"),   # Production admin
    "https://cafe-backend.preview.emergentagent.com",
    "https://styxuser.lockene.co",
]

# Remove None values
allowed_origins = [origin for origin in allowed_origins if origin]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Custom CORS handler for Emergent domains
@app.middleware("http")
async def custom_cors_middleware(request: Request, call_next):
    origin = request.headers.get("origin")
    
    # Allow all Emergent domains
    if origin and ".emergentagent.com" in origin:
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
    
    return await call_next(request)

# Mount static files
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Styx Cafe API!"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# Include routers
app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(superadmin_auth_router.router, prefix="/api/auth", tags=["SuperAdmin Auth"])
app.include_router(user_router.router, prefix="/api/user", tags=["User"])
app.include_router(admin_router.router, prefix="/api/admin", tags=["Admin"])
app.include_router(superadmin_router.router, prefix="/api/superadmin", tags=["SuperAdmin"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": str(exc) or "Something went wrong!"}
    )

# Run the application
if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 8001))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=True if os.getenv("NODE_ENV") == "development" else False
    )
