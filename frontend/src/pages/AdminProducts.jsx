import { useProducts } from '../context/ProductContext';
import { Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; // Reusing admin styles

const AdminProducts = () => {
    const { products } = useProducts();
    const navigate = useNavigate();

    return (
        <div className="admin-dashboard container">
            <header className="admin-header">
                <h1>Admin Products Library</h1>
                <p>All products added by admin ({products.length} total)</p>
            </header>

            <div className="admin-section">
                <div className="admin-actions">
                    <h2>Products Added by Admin</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/admin')}
                    >
                        <Plus size={18} /> Go to Admin Panel
                    </button>
                </div>

                {products.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                        <p>No products added yet.</p>
                    </div>
                ) : (
                    <div className="admin-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Description</th>
                                    <th>Images</th>
                                    <th>Tags</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>₹{product.price}</td>
                                        <td style={{ maxWidth: '200px', whiteSpace: 'normal' }}>
                                            {product.description?.substring(0, 50)}...
                                        </td>
                                        <td>{product.images?.length || 0} images</td>
                                        <td>{product.tags?.join(', ') || '-'}</td>
                                        <td>
                                            <button
                                                className="icon-btn"
                                                onClick={() => navigate(`/products/${product.id}`)}
                                                title="View Product"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
