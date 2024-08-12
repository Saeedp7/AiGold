import React, { useEffect, useState } from 'react';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Card, ListGroup, Collapse, Container, Row, Col, Spinner } from 'react-bootstrap';
import { fetchCategories } from '../../store/actions/categoryActions';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editData, setEditData] = useState({});
  const [newCategory, setNewCategory] = useState({ name: '', meta_keywords: '', meta_description: '' });
  const [loading, setLoading] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(`${BACKEND_URL}/shop/categories/`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error fetching categories', {
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
  }, []);

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
      toast.success('Category updated successfully', {
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
      toast.error('Error updating category', {
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
      toast.success('Category created successfully', {
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
      toast.error('Error creating category', {
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
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-4 text-center">مدیریت دسته‌بندی‌ها</h3>
              <ListGroup className="mb-4">
                {categories.map((category) => (
                  <ListGroup.Item key={category.id} className="mb-2">
                    <Card className="border-0">
                      <Card.Header
                        onClick={() => handleExpand(category)}
                        className="bg-light cursor-pointer"
                      >
                        <h5 className="mb-0">{category.name}</h5>
                      </Card.Header>
                      <Collapse in={expandedCategory === category.id}>
                        <div>
                          <Card.Body>
                            <Form onSubmit={handleEditSubmit}>
                              <Form.Group className="mb-3">
                                <Form.Label>نام دسته‌بندی</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={editData.name || ''}
                                  onChange={handleChange}
                                  required
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
                          </Card.Body>
                        </div>
                      </Collapse>
                    </Card>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button
                variant="success"
                onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                className="w-100"
              >
                {showNewCategoryForm ? 'مخفی کردن فرم دسته‌بندی جدید' : 'افزودن دسته‌بندی جدید'}
              </Button>
              <Collapse in={showNewCategoryForm}>
                <Card className="mt-3">
                  <Card.Header>
                    <h5>افزودن دسته‌بندی جدید</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleNewCategorySubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>نام دسته‌بندی</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={newCategory.name}
                          onChange={handleNewCategoryChange}
                          required
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
                  </Card.Body>
                </Card>
              </Collapse>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryList;
