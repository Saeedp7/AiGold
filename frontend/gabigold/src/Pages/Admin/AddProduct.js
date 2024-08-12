import React, { useEffect, useState } from 'react';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import NewProductForm from './Module/NewProductForm';

const AddProductPage = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get(`${BACKEND_URL}/shop/categories/`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return <NewProductForm categories={categories} />;
};

export default AddProductPage;
