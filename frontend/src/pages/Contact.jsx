
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page container">
            <h1 className="section-title">Get in Touch</h1>
            <div className="contact-content">
                <div className="contact-info">
                    <div className="info-card">
                        <Phone size={32} className="info-icon" />
                        <h3>Phone</h3>
                        <p>+91 73497 06337</p>
                    </div>
                    <div className="info-card">
                        <Mail size={32} className="info-icon" />
                        <h3>Email</h3>
                        <p>pavankr09official@gmail.com</p>
                    </div>
                    <div className="info-card">
                        <MapPin size={32} className="info-icon" />
                        <h3>Address</h3>
                        <p>10th cross Kanaka Nagara,<br />Near Veeranapalya Railway gate,<br />Bangalore 560032</p>
                    </div>
                </div>

                <div className="whatsapp-redirect">
                    <h2>Have a question?</h2>
                    <p>We are available specifically on WhatsApp for all enquiries.</p>
                    <a href="https://wa.me/917349706337" target="_blank" rel="noreferrer" className="btn btn-primary whatsapp-chat-btn">
                        <MessageCircle size={24} />
                        Chat on WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Contact;
