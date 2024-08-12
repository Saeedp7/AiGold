import React from "react";
import { Link } from "react-router-dom";

function ProductCard(props) {

  return (
    <>
      <Link to={"/product/"+ props.product.product_id} className="text-center text-decoration-none">
      <div className="product-card w-sm-75">
              <img src={props.product.thumbnail} alt={props.product.name} className="product-image" />
              <div className="product-info">
                <h5 className="product-name"  style={{textTransform:"uppercase", lineHeight:"0.8"}}>{props.product.name}</h5>
                <p className="product-brand">{props.product.brand}</p>
              </div>
            </div>
      {/* <span className="d-block">
        <img className="content-image img-fluid" src={props.product.thumbnail} alt="" />
        </span>
        <span className="d-block py-2 text-truncate text-center" style={{textTransform:"uppercase", lineHeight:"0.8"}}>
       {props.product.name}<br />
        <span className="fs-10">{props.product.price}</span>
        </span> */}
      </Link>
    </>
  );
}

export default ProductCard;
