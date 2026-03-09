import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, MessageCircle } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const handleWhatsApp = () => {
        // Redirect logic handled in Contact page or global context, but simple link here
        window.open(`https://wa.me/917349706337`, '_blank');
    };

    return (
        <footer className="footer">
            <div className="container footer-container">
                {/* 1. Brand Section */}
                <div className="footer-section brand">
                    <div className="footer-brand-header">
                        <img src="/images/logo.png" alt="Ojasee Care" className="footer-logo-img" />
                        <h2 className="footer-logo">Ojasee Care</h2>
                    </div>
                    <p className="footer-tagline">
                        Ancient wisdom, modern science. <br />
                        100% Organic, Premium Ayurvedic Hair & Personal Care.
                    </p>
                    <div className="social-icons">
                        <a href="https://www.instagram.com/ojasee.care?igsh=cno5cTJxMmY3Ym9l" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                    </div>
                </div>

                {/* 2. Quick Links Section */}
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">All Products</Link></li>
                        <li><Link to="/products?category=Men">Men's Collection</Link></li>
                        <li><Link to="/products?category=Women">Women's Collection</Link></li>
                        <li><Link to="/offers">Offers</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* 4. Contact Section */}
                <div className="footer-section contact">
                    <h3>Get in Touch</h3>
                    <div className="contact-item">
                        <MapPin size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>10th cross Kanaka Nagara , Near Veeranapalya Railway gate , Bangalore 560032</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>+91 73497 06337</span>
                    </div>
                    <div className="contact-item">
                        <Mail size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>pavankr09official@gmail.com</span>
                    </div>
                    <button className="whatsapp-btn" onClick={handleWhatsApp}>
                        <MessageCircle size={18} />
                        Chat on WhatsApp
                    </button>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Ojasee Care. All rights reserved.</p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '10px' }}>
                    <Link to="/admin" style={{ opacity: 0.5, fontSize: '0.8rem', textDecoration: 'none' }}>Admin Login</Link>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>Made with ❤️ for Nature</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
