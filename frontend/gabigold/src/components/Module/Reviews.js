import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosinterceptor';
import { BACKEND_URL } from '../utils/api';
import { toast } from 'react-toastify';

const ReviewsAndRatings = ({ currentProductId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(4);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  useEffect(() => {
    fetchReviews();
  }, [currentProductId]);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/shop/products/${currentProductId}/previews/`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  // Get current reviews
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle review form
  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) {
      toast.error('Review cannot be empty');
      return;
    }

    const reviewData = {
      text: reviewText,
      product: currentProductId, // Ensure product ID is included if required by the backend
    };
    try {
      const response = await axiosInstance.post(
        `${BACKEND_URL}/shop/products/${currentProductId}/reviews/`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews([...reviews, response.data]); // Add the new review to the list
      setReviewText("");
      setShowReviewForm(false);
      toast.success('Review submitted successfully');
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit review');
    }
  };

  if (loading) return  <div className='border-0  font-fa pe-md-5' dir='rtl'> بارگزاری نظرات...</div>;

  return (
    <div className="reviews-container mt-4" dir='rtl'>
      {reviews.length === 0 ? (
        <div className='border-0  font-fa pe-md-5' dir='rtl'>نظری درباره این کالا ارسال نشده است.</div>
      ) : (
        <>
          {currentReviews.map((review) => (
            <div key={review.id} className="card mb-3 border-0">
              <div className="card-body">
                <p className="card-text">{review.text}</p>
                <div className="card-footer text-muted">
                  <span>توسط {review.user_details.first_name || review.user_details.last_name ? `${review.user_details.first_name} ${review.user_details.last_name}` : 'کاربر مهمان'}</span>{" "}
                  <span className="ms-2">در تاریخ {new Date(review.created_at).toLocaleDateString('fa-IR')}</span>
                </div>
              </div>
            </div>
          ))}
          <nav>
            <ul className='pagination'>
              {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, i) => (
                <li key={i + 1} className='page-item'>
                  <a onClick={() => paginate(i + 1)} href='#!' className='page-link font-fa'>
                    {(i + 1)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
      
      {token && (
        <div className="mt-4">
          <button onClick={toggleReviewForm} className="btn btn-primary font-fa">
            افزودن نظر جدید
          </button>
          {showReviewForm && (
            <div className="mt-3">
              <textarea
                className="form-control font-fa"
                rows="3"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="نظر خود را بنویسید..."
              />
              <button onClick={handleReviewSubmit} className="btn btn-success mt-2 font-fa">
                ارسال نظر
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsAndRatings;
