import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Droplets, Wind, Zap, Shield } from 'lucide-react';
import './Home.css';

const Home = () => {
    const { products, getActiveOffers } = useProducts();
    const activeOffers = getActiveOffers();
    // Use optional chaining for tags since admin-added products may not have tags
    const tagged = products.filter(p => p.tags?.includes('Best Seller') || p.tags?.includes('New Arrival'));
    // If no tagged products, fall back to showing up to 4 products so the page never looks empty
    const featuredProducts = (tagged.length > 0 ? tagged : products).slice(0, 4);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <video
                    className="hero-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="https://images.unsplash.com/photo-1595152452543-e5cca283f58b?q=80&w=2070"
                >
                    <source src="/videos/hero.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="hero-overlay" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
                    zIndex: 1
                }}></div>
                <div className="container hero-container">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <span className="hero-subtitle">Pure Ayurvedic Alchemy</span>
                        <h1 className="hero-title">
                            Awaken Your <br />
                            <span className="text-highlight">Natural Radiance</span>
                        </h1>
                        <p className="hero-description">
                            Experience the timeless wisdom of Ayurveda blended with modern science.
                            100% Organic, sustainably sourced, and crafted for your inner balance.
                        </p>
                        <div className="hero-actions">
                            <Link to="/products" className="btn btn-primary">
                                Shop Collection <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </Link>
                            <Link to="/offers" className="btn btn-outline">
                                View Offers
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits / Trust Indicators */}
            <section className="section benefits-section">
                <div className="container">
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <div className="benefit-icon"><Leaf size={32} /></div>
                            <h3>100% Organic</h3>
                            <p>Sourced directly from certified organic farms across India.</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon"><ShieldCheck size={32} /></div>
                            <h3>Clinically Proven</h3>
                            <p>Formulations backed by dermatological research.</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon"><Sparkles size={32} /></div>
                            <h3>Cruelty Free</h3>
                            <p>Ethical beauty that respects all living beings.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Benefits - Hair & Scalp Care */}
            {/* <section className="section solutions-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-subtitle">Targeted Solutions</span>
                        <h2 className="section-title">Scientifically Formulated for Your Scalp & Hair</h2>
                    </div>
                    <div className="solutions-grid">
                        <motion.div className="solution-card" whileHover={{ y: -5 }}>
                            <div className="solution-icon">
                                <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=500&auto=format&fit=crop" alt="Anti-Dandruff" />
                            </div>
                            <h3>Anti-Dandruff</h3>
                            <p>Our Ayurvedic formulations with neem and tea tree oil effectively eliminate dandruff-causing bacteria and restore scalp balance naturally.</p>
                        </motion.div>
                        <motion.div className="solution-card" whileHover={{ y: -5 }}>
                            <div className="solution-icon">
                                <img src="data:image/jpeg;base64,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" />
                            </div>
                            <h3>Anti-Itching</h3>
                            <p>Cooling herbal extracts provide instant relief from scalp itching while addressing root causes of discomfort and irritation.</p>
                        </motion.div>
                        <motion.div className="solution-card" whileHover={{ y: -5 }}>
                            <div className="solution-icon">
                                <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=500&auto=format&fit=crop" alt="Irritation Relief" />
                            </div>
                            <h3>Irritation Relief</h3>
                            <p>Soothing botanical blend calms sensitive scalp, reduces redness and inflammation, and restores natural skin barrier health.</p>
                        </motion.div>
                        <motion.div className="solution-card" whileHover={{ y: -5 }}>
                            <div className="solution-icon">
                                <img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=500&auto=format&fit=crop" alt="Scalp Acne Care" />
                            </div>
                            <h3>Scalp Acne Care</h3>
                            <p>Antibacterial and antifungal ingredients specifically target scalp acne, prevent pimples, and maintain clear, healthy skin.</p>
                        </motion.div>
                        <motion.div className="solution-card" whileHover={{ y: -5 }}>
                            <div className="solution-icon">
                                <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=500&auto=format&fit=crop" alt="Frizz Control" />
                            </div>
                            <h3>Frizz Control</h3>
                            <p>Smoothing herbal extracts tame frizz, reduce flyaways, and create a sleek, polished finish for manageable, silky hair.</p>
                        </motion.div>
                        <motion.div className="solution-card" whileHover={{ y: -5 }}>
                            <div className="solution-icon">
                                <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=500&auto=format&fit=crop" alt="Dry Hair Nourishment" />
                            </div>
                            <h3>Dry Hair Nourishment</h3>
                            <p>Rich moisturizing complex deeply hydrates dry, parched hair and scalp, restoring softness, shine, and natural elasticity.</p>
                        </motion.div>
                        <motion.div className="solution-card" whileHover={{ y: -5 }}>
                            <div className="solution-icon">
                                <img src="data:image/jpeg;base64,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" />
                            </div>
                            <h3>Hair Loss Prevention</h3>
                            <p>Fortified with hair-strengthening botanicals that reduce hair fall, strengthen roots, and promote thicker, fuller hair growth.</p>
                        </motion.div>
                        <motion.div className="solution-card" whileHover={{ y: -5 }}>
                            <div className="solution-icon">
                                <img src="https://images.unsplash.com/photo-1523264653568-d3d4032d1476?q=80&w=500&auto=format&fit=crop" alt="Oil Control" />
                            </div>
                            <h3>Oil Control</h3>
                            <p>Balancing herbal formula regulates sebum production, prevents excess oiliness, and keeps scalp fresh throughout the day.</p>
                        </motion.div>
                    </div>
                </div>
            </section> */}

            {/* Shop by Category - Split Layout */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-subtitle">Curated For You</span>
                        <h2 className="section-title">Shop by Category</h2>
                    </div>
                    <div className="categories-split">
                        <Link to="/products?category=Women" className="category-card women">
                            <div className="category-content">
                                <h3>Women's Beauty</h3>
                                <span className="btn-link">Explore <ArrowRight size={16} /></span>
                            </div>
                            <div className="category-image-wrapper">
                                <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974" alt="Women's Collection" />
                            </div>
                        </Link>
                        <Link to="/products?category=Men" className="category-card men">
                            <div className="category-content">
                                <h3>Men's Essentials</h3>
                                <span className="btn-link">Explore <ArrowRight size={16} /></span>
                            </div>
                            <div className="category-image-wrapper">
                                <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2031" alt="Men's Collection" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Collection */}
            <section className="section featured-section bg-soft">
                <div className="container">
                    <div className="section-header flex-between">
                        <div>
                            <span className="section-subtitle">Most Loved</span>
                            <h2 className="section-title">Signature Collection</h2>
                        </div>
                        <Link to="/products" className="btn btn-secondary hidden-mobile">View All Products</Link>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <div className="products-grid">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                            <p>No featured products yet. Check back soon!</p>
                        </div>
                    )}
                    <div className="mobile-only text-center" style={{ marginTop: '32px' }}>
                        <Link to="/products" className="btn btn-secondary">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* Active Offers Banner */}
            {activeOffers.length > 0 && (
                <section className="section offers-banner-section">
                    <div className="container">
                        <div className="section-header text-center">
                            <span className="section-subtitle">Limited Time</span>
                            <h2 className="section-title">🔥 Current Offers</h2>
                        </div>
                        <div className="offers-banner-grid">
                            {activeOffers.map(offer => (
                                <motion.div
                                    key={offer.id}
                                    className="offer-banner-card"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <div className="offer-banner-discount">{offer.discount || '🎁'}% OFF</div>
                                    <h3>{offer.title}</h3>
                                    <p>{offer.description}</p>
                                    <span className="offer-banner-validity">
                                        Until {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="text-center" style={{ marginTop: '24px' }}>
                            <Link to="/offers" className="btn btn-primary">View All Offers <ArrowRight size={16} style={{ marginLeft: '6px' }} /></Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Customer Love */}
            <section className="section reviews-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-subtitle">Testimonials</span>
                        <h2 className="section-title">Stories of Transformation</h2>
                    </div>
                    <div className="reviews-grid">
                        <motion.div className="review-card" whileHover={{ y: -5 }}>
                            <div className="stars">★★★★★</div>
                            <p className="review-text">"I've used many products, but Ojasee's Hair Renewal Powder is unlike anything else. It feels so pure and effective."</p>
                            <div className="review-author">
                                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Priya" />
                                <div>
                                    <span className="name">Priya Sharma</span>
                                    <span className="verified">Verified Buyer</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div className="review-card" whileHover={{ y: -5 }}>
                            <div className="stars">★★★★★</div>
                            <p className="review-text">"The Beard Cleansing Bar has completely changed my grooming routine. The scent is masculine and subtle."</p>
                            <div className="review-author">
                                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200" style={{ objectPosition: 'top' }} alt="Rahul" />
                                <div>
                                    <span className="name">Rahul Khanna</span>
                                    <span className="verified">Verified Buyer</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div className="review-card" whileHover={{ y: -5 }}>
                            <div className="stars">★★★★☆</div>
                            <p className="review-text">"Packaging is luxurious, and the products deliver on their promise. A true premium ayurvedic brand."</p>
                            <div className="review-author">
                                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Anjali" />
                                <div>
                                    <span className="name">Anjali Menon</span>
                                    <span className="verified">Verified Buyer</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
