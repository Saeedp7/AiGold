import React from 'react';
import { Table, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

const ProductTable = ({ products, handleProductClick, handleDeleteProduct }) => (
    <Table striped borderless hover responsive className="mt-3">
        <thead className="bg-light text-white">
            <tr>
                <th>شناسه</th>
                <th>نام</th>
                <th>دسته‌بندی</th>
                <th>کد محصول</th>
                <th>وزن (گرم)</th>
                <th>قیمت (تومان)</th>
                <th className="border-left-none">عملیات</th>
            </tr>
        </thead>
        <tbody>
            {products.map((product) => (
                <tr key={product.product_id}>
                    <td>{product.product_id}</td>
                    <td>{product.name}</td>
                    <td>{product.category_details.name}</td>
                    <td>{product.product_code}</td>
                    <td>{product.weight}</td>
                    <td>{Math.round(product.calculated_price).toLocaleString("fa-IR")}</td>
                    <td>
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" size="sm">
                                عملیات
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-0" style={{ minWidth: "15vh", zIndex: "10000" }}>
                                <Dropdown.Item
                                    onClick={() => handleProductClick(product)}
                                    className="fw-bold text-right dropdown-item-custom w-75"
                                >
                                    <FontAwesomeIcon icon={faEye} className="ms-2" /> جزئیات
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => handleDeleteProduct(product.product_id)}
                                    className="fw-bold text-right dropdown-item-custom w-75"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="ms-2 text-danger" /> حذف
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
);

export default ProductTable;
