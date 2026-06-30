from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI(title="Schedulyx API", description="ERP Unified API", version="1.0.0")

# ==============================================================================
# Supabase Configuration
# ==============================================================================
# To use the official Supabase Python client, we need the URL and Key.
# We will uncomment and use this once you provide the API keys.
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Schedulyx!"}

@app.get("/health")
def health_check():
    return {"status": "ok", "database_configured": bool(os.getenv("DATABASE_URL"))}
