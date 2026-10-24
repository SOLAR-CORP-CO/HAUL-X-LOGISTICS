from uuid import uuid4
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()
# Temporary in-memory sample store. Replace with persistent database before launch.
shipments = []

class ShipmentRequest(BaseModel):
    customer_name: str = Field(min_length=2, max_length=120)
    email: str
    pickup: str = Field(min_length=2, max_length=250)
    delivery: str = Field(min_length=2, max_length=250)
    cargo: str = Field(min_length=2, max_length=500)
    notes: str = ""

@router.post("/shipments")
def create_shipment(payload: ShipmentRequest):
    item = {"reference": f"HX-{uuid4().hex[:8].upper()}", **payload.model_dump(), "status": "request_received"}
    shipments.append(item)
    return {"message": "Request received by this starter API.", "shipment": item}

@router.get("/shipments")
def list_shipments():
    return {"items": shipments, "note": "Temporary in-memory data; not persistent or production-ready."}
