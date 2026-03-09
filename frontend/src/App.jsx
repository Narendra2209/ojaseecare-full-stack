import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import AdminProducts from './pages/AdminProducts';
import AllProducts from './pages/AllProducts';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import './App.css';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    return (
        <Router>
            <ProductProvider>
                <CartProvider>
                    <div className="app-container">
                        <ScrollToTop />
                        <Navbar />
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/admin" element={<Admin />} />
                                <Route path="/admin-products" element={<AdminProducts />} />
                                <Route path="/all-products" element={<AllProducts />} />
                                <Route path="/offers" element={<Offers />} />
                                <Route path="/contact" element={<Contact />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </CartProvider>
            </ProductProvider>
        </Router>
    );
}

export default App;