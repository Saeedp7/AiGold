import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../components/Module/ProductCard';
import { Fade } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css";
import ReactPaginate from 'react-paginate';
import { BACKEND_URL } from '../components/utils/api';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../css/animate.css'; // Import custom CSS for animations

const ProductCat = () => {
  const [categoryName, setCategoryName] = useState('');
  const { categoryid } = useParams();
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const productsPerPage = 12;
  const pagesVisited = pageNumber * productsPerPage;
  const pageCount = Math.ceil(products.length / productsPerPage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/shop/products/by-category/${categoryid}/`);
        const data = await response.json();
        setProducts(data);
        setCategoryName(data.length > 0 ? data[0].category_details.name : ''); // Adjust based on actual data structure
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [categoryid]);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <main className='overflow-hidden content-spacing px-2 pt-10 mt-4' style={{ paddingTop: "15vh" }}>
      <Container fluid>
        <Row className="justify-content-center">
          <Col lg={9}>
            <div className="pt-2 mt-3">
              {categoryName && <span className='h4 px-3'>{categoryName}</span>}
              <div className='carousel-inner'>
                <Fade arrows={false} transitionDuration={3000} duration={2000}>
                  {products.map((product) => (
                    <div key={product.product_id} className="each-slide d-flex justify-content-center">
                      <img src={product.thumbnail} alt={product.name} />
                    </div>
                  ))}
                </Fade>
              </div>
            </div>
            <Row className='row-cols-2 row-cols-md-3 row-cols-lg-5 g-0'>
              {loading ? (
                <h3 className="text-center">Loading...</h3>
              ) : (
                <TransitionGroup component={null}>
                  {products.slice(pagesVisited, pagesVisited + productsPerPage).map((product) => (
                    <CSSTransition
                      key={product.product_id}
                      timeout={500}
                      classNames="fade"
                    >
                      <Col md={6} lg={4} xl={3}>
                        <ProductCard product={product} />
                      </Col>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              )}
            </Row>
            <ReactPaginate
              previousLabel={"قبلی"}
              nextLabel={"بعدی"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ProductCat;
