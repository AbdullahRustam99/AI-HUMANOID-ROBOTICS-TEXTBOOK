from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import query, translate  # Import the new translate router

app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(query.router, prefix="/api")
app.include_router(translate.router, prefix="/api") # Include the new translate router