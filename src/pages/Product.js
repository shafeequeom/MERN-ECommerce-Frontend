import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SingleProduct from "../components/cards/SingleProduct";
import { getProduct, productRating } from "../functions/product";

export const Product = () => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [star, setStar] = useState(0);

  const { user } = useSelector((state) => ({ ...state }));

  const { slug } = useParams();
  const loadProduct = () => {
    setLoading(true);
    getProduct(slug)
      .then((res) => {
        setLoading(false);
        let data = res.data;
        setProduct(data);
      })
      .catch((err) => console.log(err));
  };

  const ratingChanged = (newRating) => {
    setStar(newRating);
    productRating(product._id, newRating, user.token).then((res) => {
      loadProduct();
    });
  };

  useEffect(() => {
    loadProduct();
  }, []);

  useEffect(() => {
    if (product && product.ratings && product.ratings.length && user) {
      let rating = product.ratings.find(
        (item) => item.postedBy.toString() === user._id.toString()
      );
      console.log(rating);
      if (rating) setStar(rating.star);
    }
  });

  return (
    <div className="container-fluid p-4">
      {loading && <p>Loading...</p>}
      <SingleProduct
        product={product}
        ratingChanged={ratingChanged}
        star={star}
      ></SingleProduct>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          Related Products
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Product;
