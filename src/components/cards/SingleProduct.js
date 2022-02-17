import { Card, Tabs, Tooltip } from "antd";
// import { Link } from "react-router-dom";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import defaultImage from "../../images/default.png";
import ProductItems from "./ProductItems";
import ReactStars from "react-rating-stars-component";
import RatingModel from "../model/RatingModel";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { TabPane } = Tabs;
const SingleProduct = ({ product, ratingChanged, star }) => {
  const { title, description, images } = product;
  const [tooltip, setTooltip] = useState("Click to add");
  let dispatch = useDispatch();
  const { user, cart } = useSelector((state) => ({ ...state }));

  const handelAddToCart = () => {
    setTooltip("Product added");
    let cartData = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cartData = JSON.parse(localStorage.getItem("cart"));
      }
      cartData.push({
        ...product,
        count: 1,
      });
      let unique = _.uniqWith(cart, _.isEqual);
      localStorage.setItem("cart", JSON.stringify(unique));
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
    }
  };

  return (
    <div className="row">
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel infiniteLoop autoFocus>
            {images.map((img) => (
              <div key={img.public_id}>
                <img src={img.url} alt={`${title}_${img.public_id}`} />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="card-image">
            <img src={defaultImage} />
          </div>
        )}
        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More Info" key="2">
            Please contact the shipper or owner for more info in mail@info.com
          </TabPane>
        </Tabs>
      </div>
      <div className="col-md-5">
        <h1 className="bg-info p-2">{title}</h1>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <h6 className="text-center">No ratings yet</h6>
        )}

        <Card
          actions={[
            <Tooltip title={tooltip}>
              <span onClick={handelAddToCart}>
                <ShoppingCartOutlined className="text-danger" /> <br /> Add to
                Cart
              </span>
            </Tooltip>,
            <>
              <HeartOutlined className="text-warning" />
              <br />
              Add to Wishlist
            </>,
            <>
              <RatingModel>
                <ReactStars
                  count={5}
                  size={50}
                  isHalf={true}
                  value={star}
                  emptyIcon={<i className="far fa-star"></i>}
                  halfIcon={<i className="fa fa-star-half-alt"></i>}
                  fullIcon={<i className="fa fa-star"></i>}
                  activeColor="#ffd700"
                  onChange={ratingChanged}
                />
              </RatingModel>
            </>,
          ]}
        >
          <ProductItems product={product}></ProductItems>
        </Card>
      </div>
    </div>
  );
};

export default SingleProduct;
