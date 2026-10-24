import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

origins=[x.strip() for x in os.getenv("CORS_ORIGINS","http://localhost:5173").split(",") if x.strip()]
app=FastAPI(title="HAUL X Enquiry API",version="1.0.0",docs_url="/api/docs" if os.getenv("APP_ENV")!="production" else None,redoc_url=None)
app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=False,allow_methods=["GET","POST","PATCH","OPTIONS"],allow_headers=["Authorization","Content-Type"])
app.include_router(router,prefix="/api")
@app.get("/")
def health(): return {"service":"HAUL X API","status":"ok"}
