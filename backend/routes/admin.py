from datetime import datetime
from fastapi import APIRouter
from models import AdminLogin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login")
async def admin_login(credentials: AdminLogin):
    """
    Validates admin login.
    Username: 'pavan' (case-insensitive)
    Password: today's date in DDMMYYYY format
    """
    today = datetime.now()
    day = str(today.day).zfill(2)
    month = str(today.month).zfill(2)
    year = str(today.year)
    dynamic_password = f"{day}{month}{year}"

    if (
        credentials.username.lower() == "pavan"
        and credentials.password == dynamic_password
    ):
        return {"success": True, "message": "Login successful"}

    return {"success": False, "message": "Invalid credentials"}
