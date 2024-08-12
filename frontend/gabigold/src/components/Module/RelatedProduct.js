import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosinterceptor';
import { BACKEND_URL } from '../utils/api';
import ProductCard from './ProductCard';


const RelatedProducts = ({ categoryId, currentProductId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const response = await axiosInstance.get(`${BACKEND_URL}/shop/products/by-category/${categoryId}/?ordering=-created_at`);
                const filteredProducts = response.data.filter(product => product.product_id !== Number(currentProductId));
                setRelatedProducts(filteredProducts.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch related products:', error);
            }
            setLoading(false);
        };

        if (categoryId) {
            fetchRelatedProducts();
        }
    }, [categoryId, currentProductId]);

    if (loading) return <div>Loading...</div>;
    if (!relatedProducts.length) return <div>No related products found.</div>;

    return (
        <div className="'row-cols-2 row-cols-md-3 row-cols-lg-5 g-0 row justify-content-center">
            {relatedProducts.map(product => (
                <div key={product.product_id} className="col-6 col-md-3 mb-4">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};

export default RelatedProducts;
