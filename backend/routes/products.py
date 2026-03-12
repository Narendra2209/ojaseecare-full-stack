import uuid
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from database import get_db
from models import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/api/products", tags=["products"])


def _find_query(product_id: str) -> dict:
    """Build a query that matches by custom 'id' OR MongoDB '_id'."""
    try:
        return {"$or": [{"id": product_id}, {"_id": ObjectId(product_id)}]}
    except Exception:
        return {"id": product_id}


def product_helper(product: dict) -> dict:
    """Convert MongoDB document to response dict."""
    # Use custom id if present, otherwise fall back to str(_id)
    product_id = product.get("id") or str(product.get("_id", ""))
    return {
        "id": product_id,
        "name": product.get("name", ""),
        "category": product.get("category", "Men"),
        "price": product.get("price", 0),
        "description": product.get("description", ""),
        "image": product.get("image", ""),
        "mainImage": product.get("mainImage", ""),
        "images": product.get("images", []),
        "tags": product.get("tags", []),
        "ingredients": product.get("ingredients", ""),
        "video": product.get("video", ""),
        "rating": product.get("rating", 0),
        "reviews": product.get("reviews", 0),
    }


@router.get("")
async def get_products():
    db = get_db()
    products = []
    async for product in db.products.find():
        products.append(product_helper(product))
    return products


@router.get("/{product_id}")
async def get_product(product_id: str):
    db = get_db()
    product = await db.products.find_one(_find_query(product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_helper(product)


@router.post("")
async def create_product(product: ProductCreate):
    db = get_db()
    product_data = product.model_dump()
    product_data["id"] = f"p_{uuid.uuid4().hex[:12]}"

    # Set image from mainImage if not provided
    if not product_data.get("image") and product_data.get("mainImage"):
        product_data["image"] = product_data["mainImage"]

    # Combine images
    combined_images = []
    if product_data.get("mainImage"):
        combined_images.append(product_data["mainImage"])
    if product_data.get("images"):
        combined_images.extend(product_data["images"])
    product_data["images"] = combined_images
    if combined_images:
        product_data["image"] = combined_images[0]

    await db.products.insert_one(product_data)
    return {"success": True, "id": product_data["id"]}


@router.put("/{product_id}")
async def update_product(product_id: str, product: ProductUpdate):
    db = get_db()
    existing = await db.products.find_one(_find_query(product_id))
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = {k: v for k, v in product.model_dump().items() if v is not None}

    # Recalculate combined images if images or mainImage changed
    if "mainImage" in update_data or "images" in update_data:
        main_img = update_data.get("mainImage", existing.get("mainImage", ""))
        imgs = update_data.get("images", existing.get("images", []))
        combined = []
        if main_img:
            combined.append(main_img)
        combined.extend(imgs)
        update_data["images"] = combined
        if combined:
            update_data["image"] = combined[0]

    if update_data:
        await db.products.update_one({"_id": existing["_id"]}, {"$set": update_data})

    return {"success": True, "id": product_id}


@router.delete("/{product_id}")
async def delete_product(product_id: str):
    db = get_db()
    existing = await db.products.find_one(_find_query(product_id))
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    result = await db.products.delete_one({"_id": existing["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True}
