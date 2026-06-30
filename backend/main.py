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
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Schedulyx!"}

@app.get("/health")
def health_check():
    return {"status": "ok", "supabase_configured": bool(SUPABASE_URL and SUPABASE_KEY)}

@app.get("/api/appointments")
def get_appointments():
    # Example endpoint fetching from the appointments table
    response = supabase.table("appointments").select("*").execute()
    return {"data": response.data}

