
import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { adminLogin } from '../services/api';
import './Admin.css';

// Compress image to reduce base64 size (prevents 413 errors on Vercel)
const compressImage = (file, maxWidth = 800, quality = 0.6) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

const Admin = () => {
    const { products, offers, addProduct, updateProduct, deleteProduct, addOffer, deleteOffer, refreshData } = useProducts();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('products');
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingOffer, setIsEditingOffer] = useState(false);

    // Product Form State
    const [productForm, setProductForm] = useState({
        id: '',
        name: '',
        category: 'Men',
        price: '',
        description: '',
        mainImage: '', // URL input
        images: [], // Array for multiple uploaded images
        tags: '',
        ingredients: '',
        video: ''
    });

    // Offer Form State
    const [offerForm, setOfferForm] = useState({
        id: '',
        title: '',
        description: '',
        discount: '',
        startDate: '',
        endDate: '',
        productIds: []
    });

    const handleOfferSubmit = (e) => {
        e.preventDefault();
        const offerData = {
            ...offerForm,
            discount: Number(offerForm.discount)
        };

        if (isEditingOffer) {
            alert("Update feature for offers coming soon. Please delete and recreate.");
        } else {
            addOffer(offerData)
                .then((result) => {
                    alert('✓ Offer added successfully!');
                    console.log(`Offer ${result.id} added successfully`);
                    resetOfferForm();
                })
                .catch((error) => {
                    console.error('Failed to add offer:', error);
                    alert(`✗ Failed to add offer: ${error.message}`);
                });
        }
    };

    const handleDeleteOffer = (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            deleteOffer(id)
                .then(() => {
                    alert('✓ Offer deleted successfully!');
                    console.log('Offer deleted successfully');
                })
                .catch((error) => {
                    console.error('Failed to delete offer:', error);
                    alert(`✗ Failed to delete offer: ${error.message}`);
                });
        }
    };

    const resetOfferForm = () => {
        setOfferForm({
            id: '',
            title: '',
            description: '',
            discount: '',
            startDate: '',
            endDate: '',
            productIds: []
        });
        setIsEditingOffer(false);
    };

    const [username, setUsername] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await adminLogin(username, password);
            if (result.success) {
                setIsAuthenticated(true);
            } else {
                alert(`Invalid Credentials. Please use username 'pavan' and today's date as password.`);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please check if the backend server is running.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
        resetForm();
        resetOfferForm();
        setActiveTab('products');
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        const combinedImages = [
            ...(productForm.mainImage ? [productForm.mainImage] : []),
            ...(productForm.images || [])
        ];

        const productData = {
            ...productForm,
            // Ensure price is number
            price: Number(productForm.price),
            // Legacy support: 'image' is the first available image
            image: combinedImages.length > 0 ? combinedImages[0] : '',
            // New field: store all images
            images: combinedImages,
            tags: productForm.tags.split(',').map(tag => tag.trim())
        };

        if (isEditing) {
            updateProduct(productForm.id, productData)
                .then(() => {
                    alert('✓ Product updated successfully!');
                    console.log('Product updated successfully');
                    resetForm();
                })
                .catch((error) => {
                    console.error('Failed to update product:', error);
                    alert(`✗ Failed to update product: ${error.message}`);
                });
        } else {
            addProduct({ ...productData, rating: 0, reviews: 0 })
                .then((result) => {
                    alert('✓ Product added successfully! It will appear on all pages.');
                    console.log(`Product ${result.id} added successfully`);
                    resetForm();
                })
                .catch((error) => {
                    console.error('Failed to add product:', error);
                    alert(`✗ Failed to add product: ${error.message}`);
                });
        }
    };

    const handleEditProduct = (product) => {
        setProductForm({
            ...product,
            tags: product.tags.join(', ')
        });
        setIsEditing(true);
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id)
                .then(() => {
                    alert('✓ Product deleted successfully!');
                    console.log('Product deleted successfully');
                })
                .catch((error) => {
                    console.error('Failed to delete product:', error);
                    alert(`✗ Failed to delete product: ${error.message}`);
                });
        }
    };

    const resetForm = () => {
        setProductForm({
            id: '',
            name: '',
            category: 'Men',
            price: '',
            description: '',
            image: '',
            tags: '',
            ingredients: '',
            video: ''
        });
        setIsEditing(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login container">
                <form onSubmit={handleLogin} className="login-form">
                    <h2>Owner Login</h2>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '10px' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <input
                            type="password"
                            placeholder="Password "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-dashboard container">
            <header className="admin-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <h1>Admin Dashboard</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={refreshData} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                            🔄 Refresh Data
                        </button>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                            Logout
                        </button>
                    </div>
                </div>
                <div className="admin-tabs">
                    <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
                    <button className={activeTab === 'offers' ? 'active' : ''} onClick={() => setActiveTab('offers')}>Offers</button>
                </div>
            </header>

            {activeTab === 'products' && (
                <div className="admin-section">
                    <div className="admin-actions">
                        <h2>Manage Products</h2>
                        <button className="btn btn-primary" onClick={resetForm}>
                            <Plus size={18} /> Add New
                        </button>
                    </div>

                    {/* Product Form */}
                    <form className="admin-form" onSubmit={handleProductSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Images (URL or Upload)</label>
                            <input
                                type="text"
                                placeholder="Image URL (e.g., https://...)"
                                value={productForm.mainImage || ''}
                                onChange={(e) => setProductForm({ ...productForm, mainImage: e.target.value })}
                            />
                            <div className="image-uploads">
                                <label className="upload-btn">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={async (e) => {
                                            const files = Array.from(e.target.files);
                                            for (const file of files) {
                                                const compressed = await compressImage(file);
                                                setProductForm(prev => ({
                                                    ...prev,
                                                    images: [...(prev.images || []), compressed]
                                                }));
                                            }
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    <span style={{ cursor: 'pointer', color: 'var(--color-primary)', border: '1px dashed var(--color-primary)', padding: '10px', borderRadius: '8px' }}>+ Upload Images</span>
                                </label>
                            </div>
                            <div className="image-preview-list" style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {(productForm.images || []).map((img, index) => (
                                    <div key={index} style={{ position: 'relative', width: '60px', height: '60px' }}>
                                        <img src={img} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = productForm.images.filter((_, i) => i !== index);
                                                setProductForm({ ...productForm, images: newImages });
                                            }}
                                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                                {productForm.mainImage && (
                                    <div style={{ position: 'relative', width: '60px', height: '60px', border: '2px solid var(--color-primary)' }}>
                                        <img src={productForm.mainImage} alt="Main URL" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Tags (comma separated)</label>
                            <input type="text" value={productForm.tags} onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })} />
                        </div>
                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows="3"></textarea>
                        </div>
                        <div className="form-group full-width">
                            <label>Ingredients</label>
                            <textarea value={productForm.ingredients} onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })} rows="3"></textarea>
                        </div>
                        <div className="form-group full-width">
                            <label>Video (URL or Upload)</label>
                            <input
                                type="text"
                                value={productForm.video && !productForm.video.startsWith('data:') ? productForm.video : ''}
                                onChange={(e) => setProductForm({ ...productForm, video: e.target.value })}
                                placeholder="Paste YouTube/MP4 Link here..."
                            />
                            <div style={{ marginTop: '10px' }}>
                                <label className="upload-btn">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                // Limit to 5MB to avoid Vercel 413 errors
                                                if (file.size > 5 * 1024 * 1024) {
                                                    alert("Video file too large! Please upload a video smaller than 5MB, or paste a YouTube/URL link instead.");
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setProductForm(prev => ({ ...prev, video: reader.result }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    <span style={{ cursor: 'pointer', color: 'var(--color-primary)', border: '1px dashed var(--color-primary)', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>
                                        {productForm.video && productForm.video.startsWith('data:') ? 'Change Video File' : '+ Upload Video File'}
                                    </span>
                                </label>
                                {productForm.video && productForm.video.startsWith('data:') && (
                                    <span style={{ marginLeft: '10px', fontSize: '12px', color: 'green' }}>✓ Video Loaded</span>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-secondary">{isEditing ? 'Update Product' : 'Add Product'}</button>
                    </form>

                    {/* Product List */}
                    <div className="admin-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td>{p.category}</td>
                                        <td>₹{p.price}</td>
                                        <td>
                                            <button onClick={() => handleEditProduct(p)} className="icon-btn"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDeleteProduct(p.id)} className="icon-btn delete"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div >
            )}

            {
                activeTab === 'offers' && (
                    <div className="admin-section">
                        <div className="admin-actions">
                            <h2>Manage Offers</h2>
                            <button className="btn btn-primary" onClick={resetOfferForm}>
                                <Plus size={18} /> Add New Offer
                            </button>
                        </div>

                        <form className="admin-form" onSubmit={handleOfferSubmit}>
                            <div className="form-group">
                                <label>Offer Title</label>
                                <input type="text" value={offerForm.title} onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Discount (%)</label>
                                <input type="number" value={offerForm.discount} onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Applicable Products (Select Multiple)</label>
                                <select multiple value={offerForm.productIds} onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                    setOfferForm({ ...offerForm, productIds: selectedOptions });
                                }} style={{ height: '100px' }}>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                <small>Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
                            </div>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input type="date" value={offerForm.startDate} onChange={(e) => setOfferForm({ ...offerForm, startDate: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input type="date" value={offerForm.endDate} onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })} required />
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea value={offerForm.description} onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })} rows="3"></textarea>
                            </div>
                            <button type="submit" className="btn btn-secondary">{isEditingOffer ? 'Update Offer' : 'Add Offer'}</button>
                        </form>

                        <div className="admin-list">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Discount</th>
                                        <th>Validity</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offers.map(o => (
                                        <tr key={o.id}>
                                            <td>{o.title}</td>
                                            <td>{o.discount}%</td>
                                            <td>{o.startDate} to {o.endDate}</td>
                                            <td>
                                                <button onClick={() => handleDeleteOffer(o.id)} className="icon-btn delete"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Admin;
