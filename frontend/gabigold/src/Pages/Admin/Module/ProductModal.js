import React from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

const ProductModal = ({
  showModal,
  handleModalClose,
  handleEditSubmit,
  handleEditChange,
  handleImageChange,
  handleRemoveImage,
  handleThumbnailChange,
  handleRemoveThumbnail,
  selectedProduct,
  setSelectedProduct,
  categories,
  images,
  loading,
}) => {
  return (
    <Modal show={showModal} onHide={handleModalClose} size="lg" dir="rtl">
      <Modal.Header closeButton className='flex-column-reverse'>
        <Modal.Title>جزئیات محصول</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEditSubmit}>
          <Row className="gy-3 gx-4 justify-content-around"> {/* Added spacing between columns */}
            {/* Right Column for Form Inputs */}
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>نام</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedProduct.name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>دسته‌بندی</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  value={selectedProduct.category}
                  onChange={handleEditChange}
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
                  value={selectedProduct.product_code}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>وزن (گرم)</Form.Label>
                <Form.Control
                  type="number"
                  name="weight"
                  value={selectedProduct.weight}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>اجرت</Form.Label>
                <Form.Control
                  type="number"
                  name="wage"
                  value={selectedProduct.wage}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>برند</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={selectedProduct.brand}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>استاندارد محصول</Form.Label>
                <Form.Control
                  type="text"
                  name="product_standard"
                  value={selectedProduct.product_standard}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>توضیحات</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={3}
                  value={selectedProduct.description}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>مالک</Form.Label>
                <Form.Control
                  type="text"
                  name="owner"
                  value={selectedProduct.owner}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Col>
            
            {/* Left Column for Images */}
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>تصویر بندانگشتی</Form.Label>
                <Form.Control type="file" name="thumbnail" onChange={handleThumbnailChange} />
                {selectedProduct.thumbnail && !(selectedProduct.thumbnail instanceof File) && (
                  <div className="image-preview mt-2">
                    <img
                      src={selectedProduct.thumbnail}
                      alt="thumbnail"
                      className="img-thumbnail"
                      style={{ width: '100px', height: '100px' }}
                    />
                    <Button variant="danger" className="mt-2" onClick={handleRemoveThumbnail}>
                      حذف تصویر بندانگشتی
                    </Button>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>تصاویر اضافی</Form.Label>
                <Form.Control type="file" multiple name="additional_images" onChange={handleImageChange} />
              </Form.Group>
              <div className="image-preview mt-2">
                {images.map((image, index) => (
                  <div key={index} className="image-preview-item d-inline-block me-2">
                    <img
                      src={image.image}
                      alt={`product-img-${index}`}
                      className="img-thumbnail"
                      style={{ width: '100px', height: '100px' }}
                    />
                    <Button variant="danger" className="mt-1" onClick={() => handleRemoveImage(index)}>
                      حذف تصویر
                    </Button>
                  </div>
                ))}
              </div>
            </Col>
          </Row>

          {/* Bottom Row for Checkboxes and Submit Button */}
          <Row className="gy-3 mt-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>دارای سنگ</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="has_stone"
                  checked={selectedProduct.has_stone}
                  onChange={(e) =>
                    setSelectedProduct((prevProduct) => ({
                      ...prevProduct,
                      has_stone: e.target.checked,
                    }))
                  }
                />
              </Form.Group>
              {selectedProduct.has_stone && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>نوع سنگ</Form.Label>
                    <Form.Control
                      type="text"
                      name="stone_type"
                      value={selectedProduct.stone_type}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>وزن سنگ (گرم)</Form.Label>
                    <Form.Control
                      type="number"
                      name="stone_weight"
                      value={selectedProduct.stone_weight}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>قیمت سنگ (تومان)</Form.Label>
                    <Form.Control
                      type="number"
                      name="stone_price"
                      value={selectedProduct.stone_price}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>جنس سنگ</Form.Label>
                    <Form.Control
                      type="text"
                      name="stone_material"
                      value={selectedProduct.stone_material}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </>
              )}
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>محصول جدید است</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="is_new"
                  checked={selectedProduct.is_new}
                  onChange={(e) =>
                    setSelectedProduct((prevProduct) => ({
                      ...prevProduct,
                      is_new: e.target.checked,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>محصول ویژه است</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="is_featured"
                  checked={selectedProduct.is_featured}
                  onChange={(e) =>
                    setSelectedProduct((prevProduct) => ({
                      ...prevProduct,
                      is_featured: e.target.checked,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>موجود است</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="is_available"
                  checked={selectedProduct.is_available}
                  onChange={(e) =>
                    setSelectedProduct((prevProduct) => ({
                      ...prevProduct,
                      is_available: e.target.checked,
                    }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" className="my-3 w-100" variant="primary" disabled={loading}>
            {loading ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
