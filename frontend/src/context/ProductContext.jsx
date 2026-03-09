import { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
    fetchProducts as apiFetchProducts,
    fetchOffers as apiFetchOffers,
    createProduct as apiCreateProduct,
    updateProductAPI,
    deleteProductAPI,
    createOffer as apiCreateOffer,
    deleteOfferAPI,
} from '../services/api';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Keep refs for latest values
    const offersRef = useRef([]);
    const productsRef = useRef([]);
    useEffect(() => { offersRef.current = offers; }, [offers]);
    useEffect(() => { productsRef.current = products; }, [products]);

    // Initialize from API
    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsData, offersData] = await Promise.all([
                    apiFetchProducts(),
                    apiFetchOffers(),
                ]);
                console.log(`📦 Loaded ${productsData.length} products from API`);
                console.log(`🎁 Loaded ${offersData.length} offers from API`);
                setProducts(productsData);
                setOffers(offersData);
            } catch (error) {
                console.error('❌ Error loading data from API:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // ── Products ──────────────────────────────────────────────────────────────

    const addProduct = async (product) => {
        try {
            const result = await apiCreateProduct(product);
            // Refresh products from API to get the server-generated id
            const updated = await apiFetchProducts();
            setProducts(updated);
            console.log(`✓ Product added via API → id: ${result.id}`);
            return { success: true, id: result.id };
        } catch (error) {
            console.error('❌ Error adding product:', error);
            throw error;
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        try {
            await updateProductAPI(id, updatedProduct);
            const updated = await apiFetchProducts();
            setProducts(updated);
            console.log(`✓ Product "${id}" updated via API`);
            return { success: true, id };
        } catch (error) {
            console.error('❌ Error updating product:', error);
            throw error;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await deleteProductAPI(id);
            const updated = await apiFetchProducts();
            setProducts(updated);
            console.log(`✓ Product "${id}" deleted via API`);
            return true;
        } catch (error) {
            console.error('❌ Error deleting product:', error);
            throw error;
        }
    };

    // ── Offers ────────────────────────────────────────────────────────────────

    const addOffer = async (offer) => {
        try {
            const result = await apiCreateOffer(offer);
            const updated = await apiFetchOffers();
            setOffers(updated);
            console.log(`✓ Offer added via API → id: ${result.id}`);
            return { success: true, id: result.id };
        } catch (error) {
            console.error('❌ Error adding offer:', error);
            throw error;
        }
    };

    const deleteOffer = async (id) => {
        try {
            await deleteOfferAPI(id);
            const updated = await apiFetchOffers();
            setOffers(updated);
            console.log(`✓ Offer "${id}" deleted via API`);
            return true;
        } catch (error) {
            console.error('❌ Error deleting offer:', error);
            throw error;
        }
    };

    // ── Queries ───────────────────────────────────────────────────────────────

    const getActiveOffers = () => {
        if (!Array.isArray(offers)) return [];
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        return offers.filter(offer => offer.startDate <= today && offer.endDate >= today);
    };

    const getAllOffers = () => {
        if (!Array.isArray(offers)) return [];
        return offers;
    };

    const getFilteredProducts = (category) => {
        if (!category || category === 'All') return products;
        return products.filter(p => p.category === category);
    };

    const refreshData = async () => {
        try {
            setLoading(true);
            const [productsData, offersData] = await Promise.all([
                apiFetchProducts(),
                apiFetchOffers(),
            ]);
            setProducts(productsData);
            setOffers(offersData);
            console.log('🔄 Data refreshed from API');
        } catch (error) {
            console.error('❌ Error refreshing data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProductContext.Provider value={{
            products,
            offers,
            loading,
            addProduct,
            updateProduct,
            deleteProduct,
            addOffer,
            deleteOffer,
            getActiveOffers,
            getAllOffers,
            getFilteredProducts,
            refreshData
        }}>
            {children}
        </ProductContext.Provider>
    );
};
