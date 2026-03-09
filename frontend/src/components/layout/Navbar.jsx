import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cart } = useCart();
    const { getActiveOffers } = useProducts();

    const activeOffers = getActiveOffers();
    const hasActiveOffers = activeOffers.length > 0;

    const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const defaultText = "DELIVERY CHARGES ₹100 APPLIED. ADD PRODUCTS WORTH ₹1000 TO UNLOCK FREE DELIVERY!";
    const discountText = activeOffers.map(o => `${o.title}: ${o.discount}% OFF`).join(" | ");
    const announcementText = discountText ? `${defaultText} | ${discountText}` : defaultText;

    return (
        <>
            <div className="announcement-bar">
                <div className="marquee-content">
                    {announcementText} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; {announcementText} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; {announcementText}
                </div>
            </div>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-container">
                    <Link to="/" className="navbar-logo">
                        <img src="/images/logo.png" alt="" className="logo-img" />
                        <span className="brand-name">Ojasee Care</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="navbar-links desktop-only">
                        <Link to="/">Home</Link>
                        <div className="nav-dropdown">
                            <Link to="/products" className="dropdown-trigger">Products</Link>
                            <div className="dropdown-menu">
                                <Link to="/products?category=Men">Men</Link>
                                <Link to="/products?category=Women">Women</Link>
                                <Link to="/all-products">All Products Inventory</Link>
                            </div>
                        </div>
                        {hasActiveOffers && <Link to="/offers">Offers</Link>}
                        <Link to="/contact">Contact</Link>
                    </div>

                    <div className="navbar-actions">
                        <Link to="/cart" className="cart-icon">
                            <ShoppingCart size={24} />
                            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                        </Link>
                        <button className="menu-toggle mobile-only" onClick={toggleMenu}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                        <Link to="/" onClick={toggleMenu}>Home</Link>
                        <div className="mobile-submenu">
                            <span className="mobile-submenu-title">Products</span>
                            <Link to="/products?category=Men" onClick={toggleMenu} className="submenu-item">Men</Link>
                            <Link to="/products?category=Women" onClick={toggleMenu} className="submenu-item">Women</Link>
                            <Link to="/all-products" onClick={toggleMenu} className="submenu-item">All Products Inventory</Link>
                        </div>
                        {hasActiveOffers && <Link to="/offers" onClick={toggleMenu}>Offers</Link>}
                        <Link to="/contact" onClick={toggleMenu}>Contact</Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
