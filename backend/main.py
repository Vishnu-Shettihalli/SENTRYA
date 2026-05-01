from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import database, models

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SENTRYA API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from .routes import auth_routes, scam_routes, transaction_routes, behavior_routes, alert_routes

app.include_router(auth_routes.router)
app.include_router(scam_routes.router)
app.include_router(transaction_routes.router)
app.include_router(behavior_routes.router)
app.include_router(alert_routes.router)

import os
from fastapi.responses import FileResponse

# Serve the static React application
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # Don't intercept actual API calls that might be undefined
    if full_path.startswith("api/"):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="API Route not found")
        
    # Check if a static file exists (like /assets/index.js)
    file_path = os.path.join("dist", full_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
        
    # SPA fallback: Serve index.html for all other paths (e.g. /dashboard)
    if os.path.exists("dist/index.html"):
        return FileResponse("dist/index.html")
    
    return {"message": "SENTRYA App: Frontend build not found. Please run 'npm run build'."}
