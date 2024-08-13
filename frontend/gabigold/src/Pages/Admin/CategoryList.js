import React, { useEffect, useState } from 'react';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Form, Button, ListGroup, Collapse, Container, Row, Col, Spinner } from 'react-bootstrap';
import { fetchCategories } from '../../store/actions/categoryActions';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editData, setEditData] = useState({});
  const [newCategory, setNewCategory] = useState({ name: '', meta_keywords: '', meta_description: '' });
  const [loading, setLoading] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(`${BACKEND_URL}/shop/categories/`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('خطا در دریافت دسته‌بندی‌ها', {
          position: 'top-left',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      }
    };

    fetchCategories();
  }, [dispatch]);

  const handleExpand = (category) => {
    setExpandedCategory(expandedCategory === category.id ? null : category.id);
    setEditData(category);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        `${BACKEND_URL}/shop/categories/${editData.id}/`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('دسته‌بندی با موفقیت به‌روزرسانی شد', {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === editData.id ? response.data : category
        )
      );
      await dispatch(fetchCategories());
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('خطا در به‌روزرسانی دسته‌بندی', {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        `${BACKEND_URL}/shop/categories/`,
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('دسته‌بندی جدید با موفقیت ایجاد شد', {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      setCategories((prevCategories) => [...prevCategories, response.data]);
      setNewCategory({ name: '', meta_keywords: '', meta_description: '' });
      setShowNewCategoryForm(false);
      await dispatch(fetchCategories());
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('خطا در ایجاد دسته‌بندی جدید', {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5 font-fa">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="shadow-sm p-4 bg-white rounded border">
            <h3 className="mb-4 text-center text-primary">مدیریت دسته‌بندی‌ها</h3>
            <ListGroup className="mb-4">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <ListGroup.Item
                    key={category.id}
                    className="mb-2 bg-light rounded"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleExpand(category)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{category.name}</h5>
                      <span className="text-muted">{expandedCategory === category.id ? '-' : '+'}</span>
                    </div>
                    <Collapse in={expandedCategory === category.id}>
                      <div className="mt-3">
                        <Form onSubmit={handleEditSubmit}>
                          <Form.Group className="mb-3">
                            <Form.Label>نام دسته‌بندی</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={editData.name || ''}
                              onChange={handleChange}
                              required
                              style={{ backgroundColor: '#d6d6d6' }}
                              className="w-75"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>کلمات کلیدی متا</Form.Label>
                            <Form.Control
                              type="text"
                              name="meta_keywords"
                              value={editData.meta_keywords || ''}
                              onChange={handleChange}
                              required
                              style={{ backgroundColor: '#d6d6d6' }}
                              className="w-75"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>توضیحات متا</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="meta_description"
                              value={editData.meta_description || ''}
                              onChange={handleChange}
                              required
                              style={{ backgroundColor: '#d6d6d6' }}
                              className="w-75"
                            />
                          </Form.Group>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            className="w-100"
                          >
                            {loading ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            ) : (
                              'ذخیره تغییرات'
                            )}
                          </Button>
                        </Form>
                      </div>
                    </Collapse>
                  </ListGroup.Item>
                ))
              ) : (
                <p className="text-center text-muted">هیچ دسته‌بندی موجود نیست. شما می‌توانید دسته‌بندی جدیدی ایجاد کنید.</p>
              )}
            </ListGroup>
            <Button
              variant="primary"
              onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
              className="w-100"
            >
              {showNewCategoryForm ? 'مخفی کردن فرم دسته‌بندی جدید' : 'افزودن دسته‌بندی جدید'}
            </Button>
            <Collapse in={showNewCategoryForm}>
              <div className="mt-3 p-4 bg-light rounded border">
                <h5>افزودن دسته‌بندی جدید</h5>
                <Form onSubmit={handleNewCategorySubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>نام دسته‌بندی</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={newCategory.name}
                      onChange={handleNewCategoryChange}
                      required
                      style={{ backgroundColor: '#f0f0f0' }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>کلمات کلیدی متا</Form.Label>
                    <Form.Control
                      type="text"
                      name="meta_keywords"
                      value={newCategory.meta_keywords}
                      onChange={handleNewCategoryChange}
                      required
                      style={{ backgroundColor: '#f0f0f0' }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>توضیحات متا</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="meta_description"
                      value={newCategory.meta_description}
                      onChange={handleNewCategoryChange}
                      required
                      style={{ backgroundColor: '#f0f0f0' }}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100"
                  >
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      'ذخیره'
                    )}
                  </Button>
                </Form>
              </div>
            </Collapse>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryList;
