import React, { useEffect, useState } from 'react';
import axiosInstance from '../../components/utils/axiosinterceptor';
import { BACKEND_URL } from '../../components/utils/api';
import { toast } from 'react-toastify';
import { Table, Button, Form, Pagination, Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 20;
  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    handleFilterReviews();
  }, [searchTerm, reviews]);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/shop/reviews/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data);
      setFilteredReviews(response.data);
    } catch (error) {
      console.error('خطا در دریافت نظرات:', error);
      toast.error('خطا در دریافت نظرات');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟')) return;

    try {
      await axiosInstance.delete(`${BACKEND_URL}/shop/reviews/${reviewId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast.success('نظر با موفقیت حذف شد');
    } catch (error) {
      console.error('خطا در حذف نظر:', error);
      toast.error('خطا در حذف نظر');
    }
  };

  const handleFilterReviews = () => {
    const filtered = reviews.filter((review) =>
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${review.user_details.first_name} ${review.user_details.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  return (
    <Container className="my-5 font-fa">
      <Row className="mb-4 justify-content-between align-items-center">
        <Col>
          <h3 className="text-primary">مدیریت نظرات</h3>
        </Col>
        <Col className="text-end">
          <Form.Group controlId="search" className="mb-4">
            <Form.Control
              type="text"
              placeholder="جستجو بر اساس محصول یا کاربر"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-50 d-inline-block"
            />
          </Form.Group>
        </Col>
      </Row>
      
      {currentReviews.length > 0 ? (
        <>
          <Table striped borderless hover responsive className="shadow-sm">
            <thead>
              <tr>
                <th>شناسه</th>
                <th>محصول</th>
                <th>کاربر</th>
                <th>نظر</th>
                <th>تاریخ</th>
                {user?.is_staff && <th>عملیات</th>}
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>{review.product.name}</td>
                  <td>{`${review.user_details.first_name} ${review.user_details.last_name}`}</td>
                  <td>{review.text}</td>
                  <td>{new Date(review.created_at).toLocaleDateString('fa-IR')}</td>
                  {user?.is_staff && (
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteReview(review.id)}>
                        حذف
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      ) : (
        <p>هیچ نظری یافت نشد.</p>
      )}
    </Container>
  );
};

export default ReviewList;
