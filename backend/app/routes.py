import hashlib
import hmac
import os
import secrets
import smtplib
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from uuid import uuid4

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from supabase import Client, create_client

router = APIRouter()
_buckets = defaultdict(deque)
_password_hasher = PasswordHasher()
ADMIN_ALLOWLIST_EMAIL = "pritammajumder0416@gmail.com"


class Enquiry(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")
    customer_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    pickup: str = Field(min_length=2, max_length=250)
    delivery: str = Field(min_length=2, max_length=250)
    cargo_category: str = Field(min_length=2, max_length=80)
    transport_mode: str = Field(min_length=2, max_length=40)
    shipment_type: str = Field(min_length=2, max_length=40)
    packaging_type: str = Field(min_length=2, max_length=60)
    quantity: int = Field(ge=1, le=100000)
    weight_kg: float = Field(gt=0, le=10000000)
    length_cm: float | None = Field(default=None, gt=0, le=1000000)
    width_cm: float | None = Field(default=None, gt=0, le=1000000)
    height_cm: float | None = Field(default=None, gt=0, le=1000000)
    notes: str = Field(default="", max_length=2000)

    @field_validator("customer_name", "pickup", "delivery", "cargo_category", "transport_mode", "shipment_type", "packaging_type")
    @classmethod
    def clean(cls, value):
        if any(ord(char) < 32 for char in value):
            raise ValueError("Invalid characters")
        return value


class Login(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class ResetRequest(BaseModel):
    email: EmailStr


class ResetComplete(BaseModel):
    email: EmailStr
    otp: str = Field(pattern=r"^\d{6}$")
    new_password: str = Field(min_length=12, max_length=200)


class Status(BaseModel):
    status: str = Field(pattern="^(new|under_review|quoted|confirmed|completed|cancelled)$")


def database() -> Client:
    url = os.getenv("SUPABASE_URL", "").rstrip("/")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    if not url or not key:
        raise HTTPException(503, "Enquiry service is not configured.")
    return create_client(url, key)


def limit(request: Request, purpose: str, maximum: int = 5, seconds: int = 60):
    now = time.monotonic()
    client_ip = request.client.host if request.client else "unknown"
    bucket = _buckets[f"{purpose}:{client_ip}"]
    while bucket and bucket[0] < now - seconds:
        bucket.popleft()
    if len(bucket) >= maximum:
        raise HTTPException(429, "Too many attempts. Please try again later.")
    bucket.append(now)


def configured_admin_email() -> str:
    configured = os.getenv("ADMIN_EMAIL", ADMIN_ALLOWLIST_EMAIL).strip().lower()
    if not hmac.compare_digest(configured, ADMIN_ALLOWLIST_EMAIL):
        raise HTTPException(503, "Admin allowlist configuration is invalid.")
    return ADMIN_ALLOWLIST_EMAIL


def ensure_admin_account():
    email = configured_admin_email()
    initial_password = os.getenv("ADMIN_INITIAL_PASSWORD", "")
    if not initial_password:
        return
    if len(initial_password) < 12:
        raise HTTPException(503, "Initial admin password must be at least 12 characters.")
    client = database()
    existing = client.table("admin_accounts").select("email").eq("email", email).limit(1).execute().data
    if not existing:
        client.table("admin_accounts").insert({
            "email": email,
            "password_hash": _password_hasher.hash(initial_password),
        }).execute()


def admin(authorization: str | None = Header(default=None)):
    secret = os.getenv("JWT_SECRET", "")
    if len(secret) < 32 or not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Please sign in.")
    try:
        claims = jwt.decode(authorization[7:], secret, algorithms=["HS256"], issuer="haul-x-api", audience="haul-x-admin")
        if claims.get("sub") != ADMIN_ALLOWLIST_EMAIL or claims.get("role") != "admin":
            raise HTTPException(401, "Please sign in.")
        return claims
    except jwt.PyJWTError:
        raise HTTPException(401, "Session expired. Please sign in again.")


def send_otp(email: str, otp: str):
    required = ["SMTP_HOST", "SMTP_USER", "SMTP_APP_PASSWORD"]
    if any(not os.getenv(name) for name in required):
        raise HTTPException(503, "Password reset email is not configured.")
    message = EmailMessage()
    message["Subject"] = "HAUL X LOGISTICS admin password reset"
    message["From"] = os.getenv("SMTP_FROM", os.getenv("SMTP_USER"))
    message["To"] = email
    message.set_content(
        f"Your HAUL X LOGISTICS password reset code is {otp}. "
        "It expires in 10 minutes and can only be used once. If you did not request this, ignore this email."
    )
    try:
        with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT", "587")), timeout=15) as server:
            server.starttls()
            server.login(os.getenv("SMTP_USER"), os.getenv("SMTP_APP_PASSWORD"))
            server.send_message(message)
    except Exception:
        raise HTTPException(503, "Unable to send the reset email right now.")


def otp_digest(otp: str) -> str:
    pepper = os.getenv("OTP_PEPPER", "")
    if len(pepper) < 32:
        raise HTTPException(503, "Password reset is not configured.")
    return hmac.new(pepper.encode(), otp.encode(), hashlib.sha256).hexdigest()


@router.post("/enquiries", status_code=201)
def create(payload: Enquiry, request: Request):
    limit(request, "enquiries", 5, 60)
    record = payload.model_dump()
    record.update(reference=f"HX-{datetime.now(timezone.utc):%y%m%d}-{uuid4().hex[:6].upper()}", status="new")
    try:
        saved = database().table("enquiries").insert(record).execute()
        if not saved.data:
            raise RuntimeError("No database row returned")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(503, "We couldn't save your enquiry. Please try again shortly.")
    return {"message": "Enquiry received successfully.", "reference": record["reference"], "status": "new"}


@router.post("/admin/login")
def login(payload: Login, request: Request):
    limit(request, "admin-login", 5, 300)
    email = configured_admin_email()
    if not hmac.compare_digest(payload.email.lower(), email):
        raise HTTPException(401, "Incorrect email or password.")
    try:
        ensure_admin_account()
        rows = database().table("admin_accounts").select("password_hash").eq("email", email).limit(1).execute().data or []
        if not rows:
            raise HTTPException(503, "Admin account has not been initialized.")
        _password_hasher.verify(rows[0]["password_hash"], payload.password)
    except (VerifyMismatchError, InvalidHashError):
        raise HTTPException(401, "Incorrect email or password.")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(503, "Admin sign-in is temporarily unavailable.")
    secret = os.getenv("JWT_SECRET", "")
    if len(secret) < 32:
        raise HTTPException(503, "Admin sign-in is not configured.")
    now = datetime.now(timezone.utc)
    token = jwt.encode(
        {"sub": email, "role": "admin", "iss": "haul-x-api", "aud": "haul-x-admin",
         "iat": now, "exp": now + timedelta(hours=8)},
        secret, algorithm="HS256"
    )
    return {"access_token": token, "token_type": "bearer", "expires_in": 28800}


@router.post("/admin/password-reset/request")
def request_password_reset(payload: ResetRequest, request: Request):
    limit(request, "password-reset-request", 3, 900)
    email = configured_admin_email()
    # Always return the same response to avoid account enumeration.
    generic = {"message": "If the account is eligible, a reset code will be sent."}
    if not hmac.compare_digest(payload.email.lower(), email):
        return generic
    try:
        ensure_admin_account()
        otp = f"{secrets.randbelow(1_000_000):06d}"
        client = database()
        client.table("admin_password_resets").update({"consumed_at": datetime.now(timezone.utc).isoformat()}).eq("email", email).is_("consumed_at", "null").execute()
        client.table("admin_password_resets").insert({
            "email": email,
            "otp_hash": otp_digest(otp),
            "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat(),
            "attempts": 0,
        }).execute()
        send_otp(email, otp)
    except Exception:
        # Keep the public response generic; operational failures are visible in server logs.
        return generic
    return generic


@router.post("/admin/password-reset/complete")
def complete_password_reset(payload: ResetComplete, request: Request):
    limit(request, "password-reset-complete", 5, 900)
    email = configured_admin_email()
    if not hmac.compare_digest(payload.email.lower(), email):
        raise HTTPException(400, "Invalid or expired reset code.")
    client = database()
    now = datetime.now(timezone.utc)
    rows = client.table("admin_password_resets").select("*").eq("email", email).is_("consumed_at", "null").order("created_at", desc=True).limit(1).execute().data or []
    if not rows:
        raise HTTPException(400, "Invalid or expired reset code.")
    reset = rows[0]
    expires = datetime.fromisoformat(reset["expires_at"].replace("Z", "+00:00"))
    if expires <= now or int(reset.get("attempts", 0)) >= 5:
        client.table("admin_password_resets").update({"consumed_at": now.isoformat()}).eq("id", reset["id"]).execute()
        raise HTTPException(400, "Invalid or expired reset code.")
    supplied = otp_digest(payload.otp)
    if not hmac.compare_digest(supplied, reset["otp_hash"]):
        attempts = int(reset.get("attempts", 0)) + 1
        changes = {"attempts": attempts}
        if attempts >= 5:
            changes["consumed_at"] = now.isoformat()
        client.table("admin_password_resets").update(changes).eq("id", reset["id"]).execute()
        raise HTTPException(400, "Invalid or expired reset code.")
    client.table("admin_accounts").update({"password_hash": _password_hasher.hash(payload.new_password), "updated_at": now.isoformat()}).eq("email", email).execute()
    client.table("admin_password_resets").update({"consumed_at": now.isoformat()}).eq("id", reset["id"]).execute()
    return {"message": "Password reset successfully. Please sign in again."}


@router.get("/admin/enquiries")
def list_enquiries(_=Depends(admin), limit_count: int = 100):
    try:
        return {"items": database().table("enquiries").select("*").order("created_at", desc=True).limit(max(1, min(limit_count, 200))).execute().data or []}
    except Exception:
        raise HTTPException(503, "Unable to load enquiries.")


@router.patch("/admin/enquiries/{reference}")
def update(reference: str, payload: Status, _=Depends(admin)):
    try:
        result = database().table("enquiries").update({"status": payload.status, "updated_at": datetime.now(timezone.utc).isoformat()}).eq("reference", reference).execute()
        if not result.data:
            raise HTTPException(404, "Enquiry not found.")
        return {"item": result.data[0]}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(503, "Unable to update enquiry.")
