import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, getDeliveryCharge, getFinalTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page container empty-cart">
                <h2 className="section-title">Your Cart is Empty</h2>
                <p>Add some ayurvedic goodness to your life!</p>
                <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
            </div>
        );
    }

    return (
        <div className="cart-page container">
            <h1 className="section-title">Your Cart</h1>

            <div className="cart-content">
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-image" style={{ backgroundImage: `url(${item.image})` }}>
                                {!item.image && <span>{item.name}</span>}
                            </div>
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p className="item-price">₹{item.price}</p>
                            </div>
                            <div className="cart-item-actions">
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery</span>
                        <span>
                            {getDeliveryCharge() === 0 ? <span className="free-delivery">Free</span> : `₹${getDeliveryCharge()}`}
                        </span>
                    </div>
                    {getDeliveryCharge() > 0 && (
                        <p className="delivery-note">Add items worth ₹{599 - getCartTotal()} more for free delivery.</p>
                    )}
                    <div className="summary-total">
                        <span>Total</span>
                        <span>₹{getFinalTotal().toFixed(2)}</span>
                    </div>
                    <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
