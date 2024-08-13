import React, { useState } from 'react';
import axiosInstance from '../../../components/utils/axiosinterceptor';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { BACKEND_URL } from '../../../components/utils/api';
import { toast } from 'react-toastify';

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

const NewProductForm = ({ categories }) => {
    const [product, setProduct] = useState(initialProductState);
    const [images, setImages] = useState([]);
    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'thumbnail') {
            setProduct((prevProduct) => ({ ...prevProduct, thumbnail: files[0] }));
        } else {
            setImages(files);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(product).forEach((key) => {
            formData.append(key, product[key]);
        });

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            await axiosInstance.post(`${BACKEND_URL}/shop/products/create/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('محصول با موفقیت ایجاد شد');
            setProduct(initialProductState);
            setImages([]);
        } catch (error) {
            console.error('خطا در ایجاد محصول:', error);
            toast.error('خطا در ایجاد محصول');
        }
    };

    return (
        <Container className="my-5 d-flex justify-content-center font-fa">
            <Row className="w-100">
                <Col lg={10} className="mx-auto">
                    <div className="shadow-sm p-4 bg-white rounded border">
                        <h3 className="text-center mb-4 text-primary">افزودن محصول جدید</h3>
                        <Form onSubmit={handleSubmit}>
                            <Row className="gy-3">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>نام</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={product.name}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>دسته‌بندی</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="category"
                                            value={product.category}
                                            onChange={handleChange}
                                        >
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>کد محصول</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="product_code"
                                            value={product.product_code}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>وزن (گرم)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="weight"
                                            value={product.weight}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>اجرت</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="wage"
                                            value={product.wage}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>برند</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="brand"
                                            value={product.brand}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>استاندارد محصول</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="product_standard"
                                            value={product.product_standard}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>توضیحات</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            rows={3}
                                            value={product.description}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>مالک</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="owner"
                                            value={product.owner}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>دارای سنگ</Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            name="has_stone"
                                            checked={product.has_stone}
                                            onChange={(e) =>
                                                setProduct((prevProduct) => ({
                                                    ...prevProduct,
                                                    has_stone: e.target.checked,
                                                }))
                                            }
                                        />
                                    </Form.Group>
                                    {product.has_stone && (
                                        <>
                                            <Form.Group className="mb-3">
                                                <Form.Label>نوع سنگ</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="stone_type"
                                                    value={product.stone_type}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>وزن سنگ (گرم)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="stone_weight"
                                                    value={product.stone_weight}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>قیمت سنگ (تومان)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="stone_price"
                                                    value={product.stone_price}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>جنس سنگ</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="stone_material"
                                                    value={product.stone_material}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </>
                                    )}
                                    <Form.Group className="mb-3">
                                        <Form.Label>محصول جدید است</Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            name="is_new"
                                            checked={product.is_new}
                                            onChange={(e) =>
                                                setProduct((prevProduct) => ({
                                                    ...prevProduct,
                                                    is_new: e.target.checked,
                                                }))
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>محصول ویژه است</Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            name="is_featured"
                                            checked={product.is_featured}
                                            onChange={(e) =>
                                                setProduct((prevProduct) => ({
                                                    ...prevProduct,
                                                    is_featured: e.target.checked,
                                                }))
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>موجود است</Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            name="is_available"
                                            checked={product.is_available}
                                            onChange={(e) =>
                                                setProduct((prevProduct) => ({
                                                    ...prevProduct,
                                                    is_available: e.target.checked,
                                                }))
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>تصویر بندانگشتی</Form.Label>
                                        <Form.Control type="file" name="thumbnail" onChange={handleFileChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>تصاویر اضافی</Form.Label>
                                        <Form.Control type="file" multiple name="images" onChange={handleFileChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button type="submit" className="mt-3 w-100">
                                افزودن محصول
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default NewProductForm;
