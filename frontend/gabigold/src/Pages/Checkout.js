import { useEffect, useState } from "react";
import { Row, Col, Form, Button, ListGroup, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../components/utils/axiosinterceptor";
import { useSelector, useDispatch } from "react-redux";
import { BACKEND_URL } from "../components/utils/api";
import ApiService from "../components/utils/api";
import { toast } from "react-toastify";

const Checkout = () => {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [discount, setDiscount] = useState({ amount: 0, percentage: 0 });
  const token =
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("access_token");
  const items = useSelector((state) => state.cart.cartItems);
  const orderTotal = useSelector((state) => state.cart.cartTotal);
  const dispatchAction = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axiosInstance.get(
          `${BACKEND_URL}/users/update_profile/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
        setInputs(response.data);
        setUserDataLoaded(true); // Set userDataLoaded to true after data is fetched
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("مشکلی در بارگزاری رخ داده است", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    }
    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (
      userDataLoaded &&
      (!userData.first_name ||
        !userData.last_name ||
        !userData.code_melli ||
        !userData.phone_number ||
        !userData.address ||
        !userData.city ||
        !userData.state ||
        !userData.postal_code)
    ) {
      toast.error("لطفا ابتدا اطلاعات حساب خود را تکمیل کنید", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      navigate("/panel/profile");
    }
  }, [userData, userDataLoaded, navigate]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleDiscountCheck = async () => {
    try {
      const response = await axiosInstance.post(
        `${BACKEND_URL}/cart/validate-discount/`,
        { code: inputs.discount_code },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDiscount(response.data.discount);
      toast.success("کد تخفیف اعمال شد", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error validating discount code:", error);
      toast.error("کد تخفیف معتبر نیست", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      code_melli: userData.code_melli,
      phone_number: userData.phone_number,
      country: userData.country || "ایران",
      state: userData.state,
      city: userData.city,
      postal_code: userData.postal_code,
      address: userData.address,
      payment_type: inputs.payment_type,
      discount_code: inputs.discount_code || "",
    };
    console.log("Form data being sent:", formData);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await axiosInstance.post(
        `${BACKEND_URL}/cart/checkout/`,
        formData,
        config
      );
      console.log(res);
      if (inputs.payment_type === "card") {
        const paymentUrl = res.data["redirect_link"];
        localStorage.setItem("gabiorder", res.data["data"]);
        console.log(paymentUrl);
        window.location.href = paymentUrl;
      } else {
        toast.success("سفارش شما با موفقیت ثبت شد", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        navigate("/panel/orders");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("مشکلی در فرآیند پرداخت رخ داده است", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

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
          className: "font-fa",
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
          className: "font-fa",
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
        className: "font-fa",
      });
    }
  };

  const calculateDiscountedTotal = () => {
    let total = parseFloat(orderTotal);
    if (discount.amount > 0) {
      total -= discount.amount;
    } else if (discount.percentage > 0) {
      total -= (total * discount.percentage) / 100;
    }
    return total;
  };

  return (
    <div className="padding-general navDistance pt-2">
      <Row>
        <Col className="mb-5 col-md-7 col-11">
          <Form className="checkout-form" onSubmit={handleSubmit}>
            <div className="p-2">
              <h3 className="mb-3">اطلاعات شخصی</h3>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>نام</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      disabled
                      value={inputs.first_name || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>نام‌خانوادگی</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      disabled
                      value={inputs.last_name || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>کد ملی</Form.Label>
                    <Form.Control
                      type="number"
                      name="code_melli"
                      disabled
                      value={inputs.code_melli || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>شماره همراه</Form.Label>
                    <Form.Control
                      type="number"
                      name="phone_number"
                      disabled
                      value={inputs.phone_number || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <div className="mt-3 p-2">
              <h2 className="mb-3">اطلاعات ارسال</h2>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>کشور</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      disabled
                      value="ایران"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>استان</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      disabled
                      value={inputs.state || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>شهر</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      disabled
                      value={inputs.city || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>کد پستی</Form.Label>
                    <Form.Control
                      type="text"
                      name="postal_code"
                      disabled
                      value={inputs.postal_code || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>آدرس</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  disabled
                  value={inputs.address || ""}
                  name="address"
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="p-2">
              <h2 className="mb-3">اطلاعات پرداخت</h2>
              <Form.Group>
                <Form.Label>نحوه پرداخت</Form.Label>
                <Form.Select
                  value={inputs.payment_type || ""}
                  name="payment_type"
                  onChange={handleChange}
                  className="pe-5 font-fa"
                >
                  <option value="" disabled>
                    نوع پرداخت را انتخاب نمایید
                  </option>
                  <option value="card">آنلاین</option>
                  <option value="banktransfer">حواله بانکی</option>
                  <option value="cashondelivery">نقدی</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>کد تخفیف</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="discount_code"
                    value={inputs.discount_code || ""}
                    onChange={handleChange}
                  />
                  <Button
                    variant="btn btn-primary pe-auto font-fa"
                    onClick={handleDiscountCheck}
                  >
                    اعمال کد تخفیف
                  </Button>
                </InputGroup>
              </Form.Group>
            </div>
            <div className="px-4">
              <Button type="submit" className="mt-3 purchase-btn">
                {loading ? "صبور باشید ..." : "تکمیل خرید"}
              </Button>
            </div>
          </Form>
        </Col>
        <Col className="ms-3">
          <div className="border p-4">
            <h3 className="mb-3">خلاصه سفارش</h3>
            <ListGroup className="list-group-flush">
              {items.map((item) => (
                <div key={item.id}>
                  <ListGroup.Item
                    className="border-bottom border-light p-0"
                    dir="rtl"
                  >
                    <Row className="align-items-center">
                      <Col className="col-auto">
                        <img
                          src={BACKEND_URL + item.product.thumbnail}
                          className="rounded-3"
                          style={{ width: "5.5rem" }}
                          alt={item.product.name}
                        />
                      </Col>
                      <Col className="ps-0 ms--2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Link
                              to={`/product/${item.product.product_id}`}
                              className="text-decoration-none"
                            >
                              <h4 className="h6 mb-0 text-small">
                                {item.product.name}
                              </h4>
                            </Link>
                            <div className="text-start ms-4">
                              اجرت:{" "}
                              <span className="text-start">
                                {Math.round(item.product.wage).toLocaleString(
                                  "fa-IR"
                                )}{" "}
                              </span>
                              %
                            </div>
                          </div>
                          <div className="text-start ms-4">
                            قیمت :{" "}
                            <span className="text-success">
                              {Math.round(item.product.price).toLocaleString(
                                "fa-IR"
                              )}{" "}
                            </span>
                            تومان
                          </div>
                        </div>
                        وزن :{" "}
                        <span className="font-small mt-1 mb-0 font-fa">
                          {item.product.weight}
                        </span>{" "}
                        گرم
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <div className="text-start ps-2 pt-1">
                    <button
                      className="btn btn-primary pe-auto font-fa"
                      onClick={() => handleDelete(item.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </ListGroup>
            <div className="d-flex align-items-center justify-content-between my-3">
              <h5>هزینه ارسال:</h5>
              <h5>رایگان</h5>
            </div>
            {(discount.amount > 0 ||
              discount.percentage > 0) && (
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5>تخفیف:</h5>
                  <h5 className="font-fa">
                    {discount.amount > 0
                      ? `${(discount.amount).toLocaleString("fa-IR")} تومان`
                      : `${discount.percentage}%`}
                  </h5>
                </div>
              )}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5>مجموع:</h5>
              <h5
                className={
                  discount.amount > 0 || discount.percentage > 0
                    ? "text-decoration-line-through text-danger"
                    : ""
                }
              >
                {Math.round(orderTotal).toLocaleString("fa-IR")} تومان
              </h5>
              {(discount.amount > 0 || discount.percentage > 0) && (
                <h5>
                  {Math.round(calculateDiscountedTotal()).toLocaleString(
                    "fa-IR"
                  )}{" "}
                  تومان
                </h5>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
