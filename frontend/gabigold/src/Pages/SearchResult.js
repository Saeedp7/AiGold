import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../components/utils/axiosinterceptor";
import { BACKEND_URL } from "../components/utils/api";
import ProductCard from "../components/Module/ProductCard";
import { Row, Pagination } from "react-bootstrap";

const SearchResults = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20); // Number of products per page

  useEffect(() => {
    const searchParams = location.state;
    if (searchParams) {
      const fetchSearchResults = async () => {
        try {
          const response = await axiosInstance.get(`${BACKEND_URL}/shop/products/search/`, {
            params: {
              search: searchParams.searchTerm,
              min_weight: searchParams.minWeight,
              max_weight: searchParams.maxWeight,
              min_wages: searchParams.minWage,
              max_wages: searchParams.maxWage,
            },
          });
          setProducts(response.data); // Assuming the API returns an array of products
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
      fetchSearchResults();
    }
  }, [location.state]);

  // Calculate the products to display on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get total pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <main
      className="overflow-hidden content-spacing px-2 pt-10 mt-4"
      style={{ paddingTop: "15vh" }}
    >
      <h3 dir="rtl" className="font-fa me-3">
        نتایج جستجو
      </h3>
      <Row className="row-cols-2 row-cols-md-3 row-cols-lg-5 g-0">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </Row>
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </main>
  );
};

export default SearchResults;
