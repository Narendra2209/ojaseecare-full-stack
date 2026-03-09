import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { getActiveOffers } = useProducts();

    if (!product) return null;

    const activeOffers = getActiveOffers();

    // Calculate Discount
    const relevantOffer = activeOffers.find(offer =>
        offer.productIds && offer.productIds.includes(product.id)
    );

    const hasDiscount = !!relevantOffer;
    const discountPercentage = hasDiscount ? relevantOffer.discount : 0;
    const finalPrice = hasDiscount
        ? Math.round(product.price - (product.price * discountPercentage / 100))
        : product.price;

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation if clicked on button inside Link
        addToCart({ ...product, price: finalPrice });
    };

    return (
        <div className="product-card">
            <div className="product-image-wrapper">
                <Link to={`/product/${product.id}`} className="product-link">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="product-image" />
                    ) : (
                        <div className="image-placeholder">No Image</div>
                    )}
                </Link>

                {hasDiscount && (
                    <span className="badge badge-discount">
                        {discountPercentage}% OFF
                    </span>
                )}

                <div className="product-actions-overlay">
                    <button
                        className="btn-icon-action"
                        onClick={handleAddToCart}
                        aria-label="Add to Cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            <div className="product-details">
                <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <div className="product-rating">
                        <Star size={12} fill="currentColor" />
                        <span>{product.rating}</span>
                    </div>
                </div>

                <Link to={`/product/${product.id}`} className="product-title">
                    {product.name}
                </Link>

                <div className="product-footer">
                    <div className="product-price-wrapper">
                        {hasDiscount ? (
                            <>
                                <span className="price-original">₹{product.price}</span>
                                <span className="price-final">₹{finalPrice}</span>
                            </>
                        ) : (
                            <span className="price-final">₹{product.price}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
