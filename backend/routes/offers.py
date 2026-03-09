import uuid
from datetime import date
from fastapi import APIRouter, HTTPException
from database import get_db
from models import OfferCreate, OfferResponse

router = APIRouter(prefix="/api/offers", tags=["offers"])


def offer_helper(offer: dict) -> dict:
    """Convert MongoDB document to response dict."""
    return {
        "id": offer.get("id", ""),
        "title": offer.get("title", ""),
        "description": offer.get("description", ""),
        "discount": offer.get("discount", 0),
        "startDate": offer.get("startDate", ""),
        "endDate": offer.get("endDate", ""),
        "productIds": offer.get("productIds", []),
    }


@router.get("")
async def get_offers():
    db = get_db()
    offers = []
    async for offer in db.offers.find():
        offers.append(offer_helper(offer))
    return offers


@router.get("/active")
async def get_active_offers():
    db = get_db()
    today = date.today().isoformat()  # YYYY-MM-DD
    offers = []
    async for offer in db.offers.find({
        "startDate": {"$lte": today},
        "endDate": {"$gte": today},
    }):
        offers.append(offer_helper(offer))
    return offers


@router.post("")
async def create_offer(offer: OfferCreate):
    db = get_db()
    offer_data = offer.model_dump()
    offer_data["id"] = f"o_{uuid.uuid4().hex[:12]}"
    await db.offers.insert_one(offer_data)
    return {"success": True, "id": offer_data["id"]}


@router.delete("/{offer_id}")
async def delete_offer(offer_id: str):
    db = get_db()
    result = await db.offers.delete_one({"id": offer_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
    return {"success": True}
