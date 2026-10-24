from uuid import uuid4
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal

router = APIRouter()
# Temporary in-memory store for local learning only. Replace with PostgreSQL.
SHIPMENTS: dict[str, dict] = {}

class ShipmentRequest(BaseModel):
    customer_name: str = Field(min_length=2, max_length=100)
    email: str
    service: Literal["Road Freight", "Air Freight", "Ocean Freight", "Warehousing", "Last-mile Delivery"]
    pickup: str = Field(min_length=2, max_length=200)
    delivery: str = Field(min_length=2, max_length=200)
    cargo_details: str = Field(min_length=3, max_length=2000)
    payment_preference: Literal["UPI after invoice", "Pay Later request"]

@router.get("/status")
def status():
    return {"service": "haul-x-api", "version": "0.1.0"}

@router.post("/shipments", status_code=201)
def create_shipment(payload: ShipmentRequest):
    reference = f"HX-{uuid4().hex[:8].upper()}"
    record = payload.model_dump()
    record.update({"reference": reference, "status": "REQUEST_RECEIVED"})
    SHIPMENTS[reference] = record
    return record

@router.get("/shipments/{reference}")
def get_shipment(reference: str):
    record = SHIPMENTS.get(reference)
    if not record:
        raise HTTPException(status_code=404, detail="Shipment not found")
    # Public tracking is deliberately not exposed in this starter.
    return {"reference": reference, "status": record["status"]}
