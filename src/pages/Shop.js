import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProductsByCount, getProductsByFilter } from "../functions/product";
import ProductCard from "../components/cards/ProductCard";
import { Menu, Slider } from "antd";
import { DollarOutlined } from "@ant-design/icons";

const { SubMenu, Item } = Menu;
const Shop = () => {
  let dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);

  const { search } = useSelector((state) => ({ ...state }));

  const { text } = search;

  //Load pages on default
  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(12).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  const searchProducts = (form) => {
    setLoading(true);
    getProductsByFilter(form).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  //Load Products on user search
  useEffect(() => {
    const delayed = setTimeout(() => {
      searchProducts({ query: text });
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. load products based on price range
  useEffect(() => {
    searchProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-md-3 pt-3">
          <h4>Search / Filter</h4>
          <hr />
          <Menu defaultOpenKeys={["1", "2"]} mode="inline">
            <SubMenu key="1" icon={<DollarOutlined />} title="Price">
              <>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `$${v}`}
                  range
                  value={price}
                  onChange={(v) => handleSlider(v)}
                  max="4999"
                />
              </>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9 pt-3">
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}
          {products.length === 0 && <h3>No Products found</h3>}
          <div className="row pb-5">
            {products.map((p) => (
              <div className="col-md-4 mt-3" key={p._id}>
                <ProductCard product={p}></ProductCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
