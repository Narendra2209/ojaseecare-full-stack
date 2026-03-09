from pydantic import BaseModel, Field
from typing import List, Optional


class ProductCreate(BaseModel):
    name: str
    category: str = "Men"
    price: float
    description: Optional[str] = ""
    image: Optional[str] = ""
    mainImage: Optional[str] = ""
    images: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    ingredients: Optional[str] = ""
    video: Optional[str] = ""
    rating: Optional[float] = 0
    reviews: Optional[int] = 0


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image: Optional[str] = None
    mainImage: Optional[str] = None
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    ingredients: Optional[str] = None
    video: Optional[str] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    price: float
    description: Optional[str] = ""
    image: Optional[str] = ""
    mainImage: Optional[str] = ""
    images: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    ingredients: Optional[str] = ""
    video: Optional[str] = ""
    rating: Optional[float] = 0
    reviews: Optional[int] = 0


class OfferCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    discount: float
    startDate: str
    endDate: str
    productIds: Optional[List[str]] = []


class OfferResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    discount: float
    startDate: str
    endDate: str
    productIds: Optional[List[str]] = []


class AdminLogin(BaseModel):
    username: str
    password: str
