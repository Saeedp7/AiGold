import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Nav,
  ListGroup,
  Image,
  Modal,
  Button,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../utils/api";
import ApiService from "../utils/api";
import "./card.css"; // Assuming you create a CSS file for custom styles
import { cartActions } from "../../store/reducers/cartReducer";

const Cart = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [show, setShow] = useState(false); // State to handle modal visibility
  const cart = useSelector((state) => state.cart);
  const dispatchAction = useDispatch();
  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token !== undefined) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const response = await ApiService.getCart();
          dispatchAction(cartActions.setCart(response));
        } catch (error) {
            toast.error(`مشکلی پیش آمده است`, {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                className:"font-fa",
              });
        }
      }
    };

    fetchCart();
  }, [token, dispatchAction]);


  const handleDelete = async (productId) => {
    try {
      const result = await ApiService.deleteCartItem(dispatchAction, productId);
      if (result.success) {
        toast.success("محصول از سبد شما حذف شد", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className:"font-fa",
        });
      } else {
        toast.error(`محصول از سبد شما حذف نشد: ${result.error}`, {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className:"font-fa",
        });
      }
    } catch (e) {
      toast.error(`محصول از سبد شما حذف نشد: ${e.message}`, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className:"font-fa",
      });
    }
  };

  const handleProceed =  () => {
    if (isLoggedIn) {
      navigate("/checkout");
    } else {
      localStorage.setItem("next", "checkout");
      navigate("/login");
    }
  };

  const handleClear = async () => {
    try {
        await ApiService.clearCart(dispatchAction);
        toast.success("سبد شما خالی شد", {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            className:"font-fa",
          });
      } catch (e) {
        toast.error(`سبد شما خالی نشد : ${e.message}`, {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className:"font-fa",
        });
      }
    };

  const CartItem = (props) => {
    return (
      <>
        <ListGroup.Item className="border-bottom border-light p-0" dir="rtl">
          <Row className="align-items-center">
            <Col className="col-auto">
              <Image
                src={BACKEND_URL + props.product.thumbnail}
                className="rounded-3"
                style={{ width: "5.5rem" }}
              />
            </Col>
            <Col className="ps-0 ms--2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="h6 mb-0 text-small">
                  <Link to={`/product/${props.product.product_id}`} className="text-decoration-none">
                  {props.product.name}
                  </Link>
                  </h4>
                <div className="text-start ms-4">
                  اجرت:{" "}
                  <span className="text-start">
                    {Math.round(props.product.wage).toLocaleString("fa-IR")}{" "}
                  </span>
                  %
                </div>
                </div>
                <div className="text-start ms-4">
                  قیمت :{" "}
                  <span className="text-success">
                    {Math.round(props.product.price).toLocaleString("fa-IR")}{" "}
                  </span>
                  تومان
                </div>
              </div>
              وزن :{" "}
              <span className="font-small mt-1 mb-0 font-fa">
                {props.product.weight}
              </span>{" "}
              گرم
            </Col>
          </Row>
        </ListGroup.Item>
        <div className="text-start ps-2 pt-1">
          <button
            className="btn btn-primary pe-auto font-fa"
            onClick={() => handleDelete(props.id)}
          >
            حذف
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <Nav.Item className="position-relative">
        <Nav.Link
          className="text-dark icon-notifications p-0"
          onClick={() => setShow(true)}
        >
          <span className="icon icon-sm position-relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke={props.main ? "white" : "black"}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z"></path>
              <path d="M9 11v-5a3 3 0 0 1 6 0v5"></path>
            </svg>{" "}
            {cart.cartItems.length === 0 ? null : (
              <span className="badge badge-warning cart-badge">
                {cart.cartItems.length}
              </span>
            )}
          </span>
        </Nav.Link>
      </Nav.Item>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="cart-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cart / سبد خرید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup className="list-group-flush">
            {cart.cartItems.map((n) => (
              <CartItem key={`notification-${n.id}`} {...n} />
            ))}
          </ListGroup>
          <div className="text-primary fw-bold p-3 d-flex justify-content-between pe-auto">
            <div>
              جمع کل سبد :{" "}
              <span>{Math.round(cart.cartTotal).toLocaleString("fa-IR")}</span>{" "}
              تومان
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer dir="rtl" className="justify-content-between">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleProceed}
              >
                ثبت سفارش
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleClear}
              >
پاک کردن سبد              </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Cart;

