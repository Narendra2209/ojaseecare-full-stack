import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import connect_db, close_db
from routes.products import router as products_router
from routes.offers import router as offers_router
from routes.admin import router as admin_router

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db()
    yield
    # Shutdown
    await close_db()


app = FastAPI(
    title="Ojasee Care API",
    description="Backend API for Ojasee Care e-commerce",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://ojaseecare-full-stack-wadm.vercel.app",
        "https://www.ojaseecare.com",
        "https://ojaseecare.com",
    ],
    allow_origin_regex=r"https://(.*\.vercel\.app|.*\.onrender\.com|(.+\.)?ojaseecare\.com)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route routers
app.include_router(products_router)
app.include_router(offers_router)
app.include_router(admin_router)


@app.get("/")
async def root():
    return {
        "message": "Ojasee Care API is running 🌿",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
