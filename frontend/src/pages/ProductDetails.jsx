import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, Truck, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import './ProductDetails.css';
import { useEffect } from 'react';

const ProductDetails = () => {
    const { id } = useParams();
    const { products, getActiveOffers } = useProducts();
    const { addToCart } = useCart();

    const product = products.find(p => String(p.id) === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Product not found</div>;
    }

    // Suggested Products (Same category, excluding current)
    const suggestedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    // Calculate Discount
    const activeOffers = getActiveOffers();
    const relevantOffer = activeOffers.find(offer =>
        offer.productIds && offer.productIds.includes(product.id)
    );

    const hasDiscount = !!relevantOffer;
    const discountPercentage = hasDiscount ? relevantOffer.discount : 0;
    const finalPrice = hasDiscount
        ? Math.round(product.price - (product.price * discountPercentage / 100))
        : product.price;

    // Mock Reviews
    const reviews = [
        { id: 1, user: "Anjali S.", rating: 5, comment: "Absolutely love this! My hair feels so much healthier." },
        { id: 2, user: "Rohan K.", rating: 4, comment: "Great fragrance and texture. Highly recommended." },
        { id: 3, user: "Priya M.", rating: 5, comment: "Best organic product I've used in years." }
    ];

    return (
        <div className="product-details-page">
            <div className="container">
                {/* Product Main Section */}
                <div className="product-main">
                    {/* Image Section */}
                    <div className="product-gallery">
                        <div className="main-image-container">
                            <img src={product.image || product.mainImage || (product.images && product.images[0])} alt={product.name} className="main-image" />
                        </div>
                        {/* If we had multiple images, thumbnails would go here */}
                        {product.images && product.images.length > 1 && (
                            <div className="thumbnail-list">
                                {product.images.map((img, idx) => (
                                    <img key={idx} src={img} alt="" className="thumbnail" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="product-info-detail">
                        <span className="detail-category">{product.category}</span>
                        <h1 className="detail-title">{product.name}</h1>

                        <div className="detail-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < (product.rating || 5) ? "var(--color-accent)" : "none"} color="var(--color-accent)" />
                                ))}
                            </div>
                            <span>({reviews.length} Reviews)</span>
                        </div>

                        <div className="detail-price-wrapper">
                            {hasDiscount ? (
                                <>
                                    <span className="detail-price-original">₹{product.price}</span>
                                    <span className="detail-price-final">₹{finalPrice}</span>
                                    <span className="detail-discount-badge">{discountPercentage}% OFF</span>
                                </>
                            ) : (
                                <span className="detail-price">₹{product.price}</span>
                            )}
                        </div>

                        <p className="detail-description">{product.description}</p>

                        {product.ingredients && (
                            <div className="detail-ingredients">
                                <h3>Ingredients</h3>
                                <p>{product.ingredients}</p>
                            </div>
                        )}

                        {product.video && (
                            <div className="detail-video">
                                <h3>Product Video</h3>
                                {/youtube|youtu\.be/.test(product.video) ? (
                                    <div className="video-wrapper">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${product.video.split('v=')[1] ? product.video.split('v=')[1].split('&')[0] : product.video.split('/').pop()}`}
                                            title="Product Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    <video controls width="100%" className="product-video">
                                        <source src={product.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        )}

                        <div className="detail-features">
                            <div className="feature">
                                <Truck size={20} />
                                <span>Free Shipping</span>
                            </div>
                            <div className="feature">
                                <ShieldCheck size={20} />
                                <span>100% Organic Certified</span>
                            </div>
                        </div>

                        <button className="btn btn-primary detail-add-cart" onClick={() => addToCart({ ...product, price: finalPrice })}>
                            <ShoppingCart size={20} />
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="product-reviews">
                    <h2 className="section-title">Customer Reviews</h2>
                    <div className="reviews-list">
                        {reviews.map(review => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <span className="review-user">{review.user}</span>
                                    <div className="review-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < review.rating ? "var(--color-accent)" : "none"} color="var(--color-accent)" />
                                        ))}
                                    </div>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Suggested Products */}
                {suggestedProducts.length > 0 && (
                    <section className="suggested-products">
                        <h2 className="section-title">You May Also Like</h2>
                        <div className="product-grid">
                            {suggestedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
