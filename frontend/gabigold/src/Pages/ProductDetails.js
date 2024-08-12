import React, { useState, useEffect, useReducer } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import ImageMagnifier from '../components/Module/ImageMagnifier';
import { faCalculator, faPlus } from '@fortawesome/free-solid-svg-icons';
import "react-slideshow-image/dist/styles.css";
import RelatedProducts from '../components/Module/RelatedProduct';
import { BACKEND_URL } from '../components/utils/api';
import axiosInstance from '../components/utils/axiosinterceptor';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReviewsAndRatings from '../components/Module/Reviews';
import ApiService from '../components/utils/api';
import GoldPriceCalculator from './Calculator';

const initialState = { count: 1 };
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return state.count > 1 ? { count: state.count - 1 } : state;
    default:
      return state;
  }
};

const ProductDetail = () => {
  const { productid } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('info'); // Manage tabs here
  const [state, dispatchReducer] = useReducer(reducer, initialState);
  const cartItems = useSelector(state => state.cart.cartItems) || [];
  const dispatch = useDispatch();
  const [showCalculator, setShowCalculator] = useState(false); // State to manage calculator modal

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`${BACKEND_URL}/shop/products/${productid}/`, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
        setProduct(response.data);
        setSelectedImage(response.data.thumbnail);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to fetch product details');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productid]);

  const addToCart = async () => {
    try {
      const existingItem = cartItems.find(item => Number(item.product.product_id) === Number(productid));
      if (!existingItem) {
        const response = await ApiService.addToCart(dispatch, productid, 1);
        if (response.error) {
          throw new Error(response.error);
        }
        toast.success('محصول به سبد خرید شما اضافه شد');
      } else {
        toast.error('محصول در سبد خرید شما وجود دارد');
      }
    } catch (error) {
      if (error.message === 'Item already in cart') {
        toast.error('محصول در سبد خرید شما وجود دارد');
      } else {
        toast.error(`Failed to add product to cart: ${error.message}`);
      }
    }
  };
  
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  function extractFarsiPart(text) {
    const farsiPart = text.match(/[^\x00-\x7F]+/g);
    return farsiPart ? farsiPart.join('') : '';
  }

  return (
    <main className='overflow-hidden content-spacing px-2 pt-10 mt-5' style={{paddingTop:"15vh"}} >
      <div className="row g-0 g-sm-4 g-md-5">
        <aside className="col-2 d-none d-lg-flex align-items-end">
          <div className="sticky-bottom"></div>
        </aside>
        <div className="col-sm-6 col-lg-4 z-index-1">
          <div className="d-sm-none">
            <div
              itemProp="headline"
              className="fw-light mb-0 h3  text-uppercase"
            >
              {product.name}{" "}
            </div>
            <div
              itemProp="headline"
              className="fw-light mb-3 h5  text-uppercase"
            >
              <span className="font-fa lh-1">
                {" "}
                {product.category_details.name}
              </span>
            </div>
          </div>
          <div className="cover">
            <ImageMagnifier imgUrl={selectedImage} />
          </div>

          <div className="gallery">
            <img
              src={product.thumbnail}
              alt={`Thumbnail`}
              className="img-thumbnail"
              onClick={() => handleImageClick(product.thumbnail)}
              style={{ margin: '5px', width: '100px', cursor: 'pointer' }}
            />
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.image}
                alt={`Thumbnail ${index}`}
                className="img-thumbnail"
                onClick={() => handleImageClick(img.image)}
                style={{ margin: '5px', width: '100px', cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <h1
            itemProp="headline"
            className="fw-light d-none d-sm-block mb-0 fs-3 text-uppercase"
          >
            {product.name}
          </h1>
          {product.is_available ? (
            <h5
              className='mt-4'
              style={{
                textOrientation: "mixed",
                writingMode: "vertical-lr",
                float: "right",
                color: "green",
              }}
            >
              مـــوجـــود
            </h5>
          ) : (
            <h5
              className='mt-4'
              style={{
                textOrientation: "mixed",
                writingMode: "vertical-lr",
                float: "right",
                color: "red",
              }}
            >
              نا مـــوجـــود{" "}
            </h5>
          )}
          <h2 className="fw-light d-none d-sm-block mb-3  text-uppercase">
            <Link
              to={
                "/category/" + product.category
              }
              className="text-decoration-none"
            >
              <span className="font-fa lh-1">
                {product.category_details.name}
              </span>
            </Link>
          </h2>
          <div className="fs-3 mt-sm-5 pt-sm-5 text-uppercase lh-1 mb-3 "></div>
          <div>
            <div className="fs-5 lh-1 mb-3 number">
              Brand : <span className="text-uppercase">{product.brand}</span>{" "}
            </div>{" "}
            <div className="fw-normal">
              Product Code : {product.product_code}
            </div>
            <div className="fw-normal mb-1">
              Product Standard : {product.product_standard}
            </div>{" "}
            <div className="d-flex align-items-center">
              Weight : {product.weight} gr
            </div>{" "}
            <span className="text-nowrap d-inline-block">
              <span>Price : </span>
              <span>{Math.round(product.price / 49900)}</span>
              <span> $</span>
            </span>
          </div>
          <div className="nav nav-tabs pe-xxl-5" dir='rtl'>
            <button className={`nav-link ${selectedTab === 'info' ? 'active' : ''}`} onClick={() => setSelectedTab('info')}>
              اطلاعاﺗـــــ محصول
            </button>
            <button className={`nav-link ${selectedTab === 'reviews' ? 'active' : ''}`} onClick={() => setSelectedTab('reviews')}>
              نظرات
            </button>
          </div>
          {selectedTab === 'info' && (
            <div className="product-info  p-3">
              <div itemProp="articleBody" className="pe-xxl-5">
                <div className="rtl font-fa">
                  <span dir="rtl">
                    وزن{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {(product.weight).toLocaleString("fa-IR")}
                    </span>
                    گرم
                  </span>
                  <br />
                  <span dir="rtl">
                    طلای{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {(18).toLocaleString("fa-IR")}
                    </span>
                    عیار
                  </span>
                  <br />
                  <span dir="rtl">
                    اجرت ساخت این کار{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {Math.round(product.wage).toLocaleString("fa-IR")}
                    </span>
                    % می باشد.
                  </span>
                  <span className="Apple-converted-space">
                    <div dir="rtl">
                      {product.description.split(".").map((i, key) => {
                        return <div key={key}>{i}.</div>;
                      })}
                    </div>
                  </span>
                </div>
                <div
                  className="mt-3 rtl font-fa"
                  dir="rtl"
                  style={{ fontSize: "0.8rem" }}
                >
                  <span>ضمانت تعویض کالا به مدت {(48).toLocaleString("fa-IR")} ساعت</span>
                  <br />
                  <span>ارسال مطمئن و بیمه شده به سراسر کشور</span>
                  <br />
                  <span>گــارانتی اصالت و سلامت فیزیکی کالا</span>
                  <br />
                  <span>دارای فاکتور رسمی و بسته بندی مناسب</span>
                  <br />
                  <div>
        جهت اطلاع از نحوه محاسبه قیمت از{" "}
        <Link to="/calculator" className="text-decoration-none">
          <span
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faCalculator} style={{ fontSize: "1rem", marginLeft: "5px" }} />
            ماشین حساب
          </span>
        </Link>{" "}
        استفاده فرمایید.
      </div>

                  <br />
                </div>
                <div className="mt-3 ">
                  <div className="p-0 flex-fill bd-highligh" dir="rtl">
                    <h6 className="font-fa lh-1" style={{ fontSize: "0.9rem" }}>
                      قیمت :
                      <span
                        style={
                          product.is_available
                            ? {
                                fontFamily: "PeydaWeb",
                                fontWeight: "bold",
                                color: "green",
                              }
                            : {
                                fontFamily: "PeydaWeb",
                                fontWeight: "bold",
                                color: "red",
                              }
                        }
                      >
                        {Math.round(product.price).toLocaleString("fa-IR")}{" "}
                      </span>
                      <span>&nbsp;&nbsp;تومان &nbsp;&nbsp;</span>
                    </h6>
                  </div>
                </div>{" "}
                <div
                  className="position-relative d-flex justify-content-end max-auto m-0"
                  style={{ right: "15%" }}
                ></div>
              </div>
              <div className="mt-0 mx-auto pe-xxl-5" dir="rtl">
                <button
                  className="btn btn-link min-h-auto py-0 pe-0 fs-18px d-inline-block align-items-center text-decoration-none"
                  onClick={addToCart}
                  disabled={!product.is_available}
                >
                  <span className="font-fa pt-0 w-100 h3">
                    <span
                      style={
                          product.is_available
                          ? { fontSize: "0.9rem", color: "green" }
                          : { fontSize: "0.9rem", color: "red" }
                      }
                    >
                      <FontAwesomeIcon icon={faPlus} />{" "}
                      افزودن به سبد خرید
                    </span>
                  </span>
                </button>
              </div>
              <div className="pe-xxl-5">
                <div
                  className="mt-3 mx-auto text-decoration-none"
                  dir="rtl"
                  style={{ fontSize: "0.8rem" }}
                >
                  <div className="h7">
                    <span className='h5 ms-0 mx-0' style={{
                    textOrientation: "mixed",
                    writingMode: "vertical-lr",
                    float: "left",
                  }}>شــیـراز / ایــران</span><br />

                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="btn-call-outing text-decoration-none"
                      href="tel:07136340201"
                    >
                      سفارش تلفنی | 36340201-071
                    </a>
                  </div>
                  <div className="h7">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="btn-whatsapp text-decoration-none"
                      href="https://wa.me/09363684122?text="
                    >
                      سفارش از طریق | WhatsApp
                    </a>
                  </div>
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          )}
          {selectedTab === 'reviews' && (
            <div className="product-reviews p-3">
              <ReviewsAndRatings currentProductId={productid} />
            </div>
          )}
        </div>
        <aside className="col-2 d-none d-lg-flex align-items-end justify-content-end">
          <div className="sticky-bottom"></div>
        </aside>
        <div className="col-sm-6 col-lg-4"></div>
      </div>
      <div className="row g-0 g-sm-4 g-md-5">
        <div  dir="rtl" className='col-md-10 fw-bold font-fa' style={{fontSize:"1.5rem"}}>جدیدترین {extractFarsiPart(product.category_details.name)} ها</div> 
        <RelatedProducts categoryId={product.category} currentProductId={productid}/>
      </div>
      <div className="row g-0 g-sm-4 g-md-5">
        <aside className="col-2 d-none d-lg-flex align-items-end">
          <div className="sticky-bottom"></div>
        </aside>
        <div
          id="masonry"
          className="col-8 d-flex align-content-center flex-wrap flex-fill align-items-center"
          style={{ position: "relative" }}
        >
        </div>

        <aside className="col-2 d-none d-lg-flex align-items-end">
          <div className="sticky-bottom"></div>
        </aside>
      </div>

      <div className="d-flex flex-grow-1 justify-content-center align-items-center"></div>
      <GoldPriceCalculator show={showCalculator} handleClose={() => setShowCalculator(false)} /> {/* Include the calculator modal here */}
    </main>
  );
};

export default ProductDetail;
