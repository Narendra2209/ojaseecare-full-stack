import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ui/ProductCard';
import { useSearchParams } from 'react-router-dom';
import './Products.css';

import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const Products = () => {
    const { products } = useProducts();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    const filtered = categoryParam
        ? products.filter(p => p.category === categoryParam)
        : products;

    return (
        <div className="products-page container">
            <header className="products-header">
                <h1 className="section-title">
                    {categoryParam ? `${categoryParam}'s Collection` : 'All Products'}
                </h1>
                <p className="products-subtitle">
                    Explore our range of natural and ayurvedic products designed for your care.
                </p>
            </header>

            {filtered.length > 0 ? (
                <motion.div
                    className="product-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filtered.map(product => (
                        <motion.div key={product.id} variants={itemVariants}>
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="no-products">
                    <p>No products found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Products;
