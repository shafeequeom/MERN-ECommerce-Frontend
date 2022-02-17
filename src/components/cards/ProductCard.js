import { Card, Tooltip } from "antd";
import defaultImage from "../../images/default.png";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Meta } = Card;
const ProductCard = ({ product }) => {
  const { title, description, images, slug, price } = product;
  const [tooltip, setTooltip] = useState("Click to add");
  let dispatch = useDispatch();
  const { user, cart } = useSelector((state) => ({ ...state }));

  const handelAddToCart = () => {
    setTooltip("Product added");
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.push({
        ...product,
        count: 1,
      });
      let unique = _.uniqWith(cart, _.isEqual);
      localStorage.setItem("cart", JSON.stringify(unique));
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
      dispatch({
        type: "SET_DRAWER",
        payload: true,
      });
    }
  };
  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <p className="text-center p-2">No rating yet</p>
      )}

      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : defaultImage}
            alt={title}
            style={{ height: "150px", objectFit: "cover" }}
            className="p-2"
          />
        }
        actions={[
          <Link to={`/products/${slug}`}>
            <EyeOutlined className="text-warning" />
            <br />
            View Product
          </Link>,
          <Tooltip title={tooltip}>
            <span onClick={handelAddToCart}>
              <ShoppingCartOutlined className="text-danger" /> <br /> Add to
              Cart
            </span>
          </Tooltip>,
        ]}
      >
        EditOul
        <Meta
          title={`${title} - $${price}`}
          description={`${description && description.substring(0, 40)}..`}
        ></Meta>
      </Card>
    </>
  );
};

export default ProductCard;
