import { useProducts } from '../context/ProductContext';
import { Share2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AllProducts.css';

const AllProducts = () => {
    const { products, offers, refreshData } = useProducts();
    const navigate = useNavigate();

    const exportData = () => {
        const dataToExport = {
            products: products,
            offers: offers,
            exportDate: new Date().toLocaleString(),
            totalProducts: products.length,
            totalOffers: offers.length
        };

        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `ojasee-care-products-${Date.now()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleRefresh = () => {
        refreshData();
    };

    return (
        <div className="all-products-page container">
            <header className="products-header">
                <h1>📦 Complete Product Inventory</h1>
                <p className="subtitle">View all products and offers in your system</p>
            </header>

            {/* Summary Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{products.length}</div>
                    <div className="stat-label">Total Products</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{offers.length}</div>
                    <div className="stat-label">Active Offers</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{products.filter(p => p.category === 'Men').length}</div>
                    <div className="stat-label">Men's Products</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{products.filter(p => p.category === 'Women').length}</div>
                    <div className="stat-label">Women's Products</div>
                </div>
            </div>

            {/* Actions */}
            <div className="actions-bar">
                <button className="btn btn-primary" onClick={() => navigate('/admin')}>
                    <Plus size={18} /> Go to Admin Panel
                </button>
                <button className="btn btn-secondary" onClick={exportData}>
                    <Share2 size={18} /> Export Data
                </button>
                <button className="btn btn-warning" onClick={handleRefresh}>
                    <RefreshCw size={18} /> Refresh Data
                </button>
            </div>


            {/* Products Section */}
            <section className="inventory-section">
                <h2>📋 All Products</h2>
                {products.length === 0 ? (
                    <div className="empty-state">
                        <p>No products found. <a href="/admin">Add products from Admin Panel</a></p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card-detailed">
                                <div className="product-header">
                                    <h3>{product.name}</h3>
                                    <span className="product-id">{product.id}</span>
                                </div>

                                <div className="product-details">
                                    <div className="detail-row">
                                        <span className="label">Category:</span>
                                        <span className="value">{product.category}</span>
                                    </div>
                                    {product.subcategory && (
                                        <div className="detail-row">
                                            <span className="label">Subcategory:</span>
                                            <span className="value">{product.subcategory}</span>
                                        </div>
                                    )}
                                    <div className="detail-row">
                                        <span className="label">Price:</span>
                                        <span className="value price">₹{product.price}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Rating:</span>
                                        <span className="value">⭐ {product.rating} ({product.reviews} reviews)</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Description:</span>
                                        <span className="value description">{product.description}</span>
                                    </div>
                                    {product.tags && product.tags.length > 0 && (
                                        <div className="detail-row">
                                            <span className="label">Tags:</span>
                                            <div className="tags">
                                                {product.tags.map((tag, idx) => (
                                                    <span key={idx} className="tag">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {product.images && product.images.length > 0 && (
                                        <div className="detail-row">
                                            <span className="label">Images:</span>
                                            <span className="value">{product.images.length} image(s)</span>
                                        </div>
                                    )}
                                    {product.ingredients && (
                                        <div className="detail-row">
                                            <span className="label">Ingredients:</span>
                                            <span className="value description">{product.ingredients}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="product-actions">
                                    <button
                                        className="action-link"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        className="action-link"
                                        onClick={() => navigate('/admin')}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Offers Section */}
            <section className="inventory-section">
                <h2>🎁 Active Offers</h2>
                {offers.length === 0 ? (
                    <div className="empty-state">
                        <p>No offers currently active. <a href="/admin">Add offers from Admin Panel</a></p>
                    </div>
                ) : (
                    <div className="offers-list">
                        {offers.map(offer => (
                            <div key={offer.id} className="offer-card">
                                <div className="offer-header">
                                    <h3>{offer.title}</h3>
                                    <span className="discount-badge">{offer.discount}% OFF</span>
                                </div>
                                <div className="offer-details">
                                    <p><strong>Description:</strong> {offer.description}</p>
                                    <p><strong>Valid Period:</strong> {offer.startDate} to {offer.endDate}</p>
                                    <p><strong>Applicable Products:</strong> {offer.productIds?.length || 0} product(s)</p>
                                    <div className="applicable-products">
                                        {offer.productIds && offer.productIds.map(id => {
                                            const product = products.find(p => p.id === id);
                                            return (
                                                <span key={id} className="product-badge">
                                                    {product?.name || `Product ${id}`}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Raw Data Export */}
            {/*<section className="inventory-section">
                <h2>📊 Raw Data</h2>
                <details className="raw-data">
                    <summary>View Raw JSON Data</summary>
                    <pre><code>{JSON.stringify({ products, offers }, null, 2)}</code></pre>
                </details>
            </section>*/}
        </div>
    );
};

export default AllProducts;
