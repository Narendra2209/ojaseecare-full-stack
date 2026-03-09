
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import { Tag, Clock, ArrowRight, Percent } from 'lucide-react';
import './Offers.css';

const Offers = () => {
    const { offers, products, getActiveOffers } = useProducts();
    const activeOffers = getActiveOffers();

    // Helper to check if an offer is currently active
    const isActive = (offer) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        return offer.startDate <= today && offer.endDate >= today;
    };

    // Get product names for an offer
    const getOfferProducts = (offer) => {
        if (!offer.productIds || offer.productIds.length === 0) return [];
        return products.filter(p => offer.productIds.includes(p.id));
    };

    return (
        <div className="offers-page container">
            <header className="offers-header">
                <h1 className="section-title">Exclusive Offers</h1>
                <p className="offers-subtitle">
                    Discover amazing deals on our premium ayurvedic products
                </p>
            </header>

            {offers && offers.length > 0 ? (
                <div className="offers-list">
                    {offers.map(offer => {
                        const active = isActive(offer);
                        const offerProducts = getOfferProducts(offer);
                        return (
                            <div key={offer.id} className={`offer-item ${active ? 'offer-active' : 'offer-expired'}`}>
                                {active && <span className="offer-badge">🔥 Active Now</span>}
                                {!active && <span className="offer-badge expired-badge">Expired</span>}
                                <div className="offer-content">
                                    <div className="offer-top">
                                        <h2>{offer.title}</h2>
                                        {offer.discount && (
                                            <div className="offer-discount">
                                                <Percent size={18} />
                                                <span>{offer.discount}% OFF</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="offer-desc">{offer.description}</p>
                                    <div className="offer-dates">
                                        <Clock size={14} />
                                        <span>
                                            {new Date(offer.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            {' — '}
                                            {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    {offerProducts.length > 0 && (
                                        <div className="offer-products">
                                            <h4><Tag size={14} /> Applicable Products:</h4>
                                            <div className="offer-product-list">
                                                {offerProducts.map(p => (
                                                    <Link key={p.id} to={`/product/${p.id}`} className="offer-product-chip">
                                                        {p.name} <ArrowRight size={12} />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="no-offers">
                    <p>No offers at the moment. Please check back later!</p>
                </div>
            )}
        </div>
    );
};

export default Offers;
