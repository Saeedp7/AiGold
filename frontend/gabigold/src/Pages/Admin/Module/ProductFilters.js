import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const ProductFilters = ({ filters, handleFilterChange, handleFilterSubmit, categories }) => (
    <Form onSubmit={handleFilterSubmit} className="mb-4">
        <Row className="align-items-end flex-md-nowrap">
            <Col xs={12} sm={4} md={3}>
                <Form.Group controlId="category">
                    <Form.Label>دسته‌بندی</Form.Label>
                    <Form.Control 
                        as="select" 
                        name="category" 
                        value={filters.category} 
                        onChange={handleFilterChange}
                        className='w-75'
                    >
                        <option value="">همه</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </Col>
            <Col xs={12} sm={4} md={3}>
                <Form.Group controlId="product_code">
                    <Form.Label>کد محصول</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="product_code" 
                        value={filters.product_code} 
                        onChange={handleFilterChange} 
                        className='w-75'
                    />
                </Form.Group>
            </Col>
            <Col xs={12} sm={4} md={3}>
                <Form.Group controlId="min_weight">
                    <Form.Label>وزن (گرم)</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="min_weight" 
                        value={filters.weight} 
                        onChange={handleFilterChange} 
                        className='w-75'
                    />
                </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={3} className="text-end mt-3 mt-md-0">
                <Button 
                    type="submit" 
                    className="w-50" 
                    variant="primary"
                >
                    فیلتر
                </Button>
            </Col>
        </Row>
    </Form>
);

export default ProductFilters;
