import React, { useState, useEffect } from 'react';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { Pagination, Button, Container, Row, Col } from 'react-bootstrap';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';
import ProductFilters from './Module/ProductFilters';
import ProductTable from './Module/ProductTable';
import ProductModal from './Module/ProductModal';
import { Link } from 'react-router-dom';

const initialProductState = {
    name: '',
    description: '',
    brand: '',
    product_code: '',
    product_standard: '',
    weight: '',
    wage: '',
    price: '',
    has_stone: false,
    is_new: false,
    is_featured: false,
    is_available: true,
    thumbnail: null,
    owner: '',
    category: '',
};

const ProductList = () => {
    const [selectedProduct, setSelectedProduct] = useState(initialProductState);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({ category: '', name: '', product_code: '' });
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get(`${BACKEND_URL}/shop/products/`);
            setProducts(response.data);
        } catch (error) {
            console.error('خطا در دریافت محصولات:', error);
            toast.error('خطا در دریافت محصولات');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`${BACKEND_URL}/shop/categories/`);
            setCategories(response.data);
        } catch (error) {
            console.error('خطا در دریافت دسته‌بندی‌ها:', error);
            toast.error('خطا در دریافت دسته‌بندی‌ها');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟')) {
            try {
                await axiosInstance.delete(`${BACKEND_URL}/shop/products/${productId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('محصول با موفقیت حذف شد');
                setProducts(products.filter(product => product.product_id !== productId)); // Update state to remove the deleted product
            } catch (error) {
                toast.error('خطا در حذف محصول');
            }
        }
    };

    const handleFilterSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (filters.category) {
                response = await axiosInstance.get(`${BACKEND_URL}/shop/products/by-category/${filters.category}/`, {
                    params: {
                        name: filters.name,
                        product_code: filters.product_code,
                        min_weight: filters.weight,
                    },
                });
            } else {
                response = await axiosInstance.get(`${BACKEND_URL}/shop/products/search/`, {
                    params: filters,
                });
            }
            setProducts(response.data);
        } catch (error) {
            console.error('خطا در فیلتر کردن محصولات:', error);
            toast.error('خطا در فیلتر کردن محصولات');
        }
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setImages(product.images);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setImages([]);
        setRemovedImages([]);
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="my-5">
            <Row className="mb-4 justify-content-between align-items-center">
                <Col xs={12} md={6}>
                    <h3 className="text-primary text-center text-md-start">مدیریت محصولات</h3>
                </Col>
                <Col xs={12} md={6} className="text-center text-md-end mt-3 mt-md-0">
                    <Button as={Link} to="/panel/addproduct" variant="success">
                        افزودن محصول جدید
                    </Button>
                </Col>
            </Row>
            <div className="shadow-sm p-4 bg-white rounded border mb-4">
                <ProductFilters
                    filters={filters}
                    categories={categories}
                    handleFilterChange={handleFilterChange}
                    handleFilterSubmit={handleFilterSubmit}
                />
                <ProductTable
                    products={currentProducts}
                    handleProductClick={handleProductClick}
                    handleDeleteProduct={handleDeleteProduct}
                />
                <Pagination className="justify-content-center mt-4">
                    {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map((number) => (
                        <Pagination.Item
                            key={number + 1}
                            onClick={() => paginate(number + 1)}
                            active={currentPage === number + 1}
                        >
                            {number + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
            {selectedProduct && (
                <ProductModal
                    showModal={showModal}
                    handleModalClose={handleModalClose}
                    selectedProduct={selectedProduct}
                    categories={categories}
                    images={images}
                    loading={loading}
                />
            )}
        </Container>
    );
};

export default ProductList;
