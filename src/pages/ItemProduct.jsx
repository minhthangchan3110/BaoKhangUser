import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Helmet from "../components/Helmet/Helmet";

export default function ItemProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Bắt đầu loading
        const docRef = doc(db, "product", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data);
          await fetchSimilarProducts(data.Category);
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      } catch (err) {
        setError("Lỗi khi tải bài viết.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSimilarProducts = async (category) => {
      try {
        const q = query(
          collection(db, "product"),
          where("Category", "==", category)
        );
        const querySnapshot = await getDocs(q);
        const products = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== id) {
            products.push({ id: doc.id, ...doc.data() });
          }
        });
        setSimilarProducts(products);
      } catch (err) {
        setError("Lỗi khi tải sản phẩm tương tự.");
      }
    };

    const fetchCategory = async () => {
      const querySnapshot = await getDocs(collection(db, "category"));
      const nameCategory = [];
      querySnapshot.forEach((doc) => {
        nameCategory.push({ id: doc.id, ...doc.data() });
      });
      setCategory(nameCategory);
    };

    fetchProducts();
    fetchCategory(); // Gọi hàm lấy danh mục sản phẩm
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading className="animate-spin text-5xl text-red-500" />
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  const handleCategory = (categoryName) => {
    navigate(`/product-list?category=${categoryName}`);
  };

  const handleProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <Helmet>
      <div className="font-montserrat py-2 md:px-[100px] px-4">
        <div className="md:grid md:grid-cols-4 flex flex-col">
          <section className="md:col-span-3">
            {product && (
              <div className="md:grid md:grid-cols-2 gap-4 flex flex-col md:border-r border-gray-300">
                <div className="relative border col-span-1 border-gray-300 rounded-lg w-full h-[400px] border-r">
                  <img
                    className="absolute inset-0 rounded-lg w-full h-full object-cover"
                    src={product.Image[0]}
                    alt={product.Name}
                  />
                </div>

                <div className="w-full md:col-span-1">
                  <div className="text-red-500 font-bold text-xl">
                    {product.Name}
                  </div>
                  <div className="text-gray-700 mt-2">
                    {product.Digital || "Chưa có thông số chi tiết"}
                  </div>
                  <div className="text-gray-700 mt-2">
                    {product.ProductDetails || "Chưa có thông tin chi tiết"}
                  </div>
                  <div className="text-red-500 mt-2 font-semibold">Liên hệ</div>
                </div>
              </div>
            )}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Sản phẩm tương tự</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {similarProducts.length > 0 ? (
                  similarProducts.map((item) => (
                    <div
                      className="col-span-1 w-full font-montserrat shadow-lg hover:scale-105 duration-300 overflow-hidden"
                      key={item.id}
                      onClick={() => handleProduct(item.id)}
                    >
                      <div className="w-full lg:h-[150px] h-[150px] relative">
                        <img
                          className="absolute inset-0 w-full h-full object-cover"
                          src={item.Image}
                          alt={item.title}
                        />
                      </div>
                      <div className="px-4 flex flex-col gap-2 py-4">
                        <div className="font-semibold text-xs hover:text-red-500 cursor-pointer">
                          {item.Name}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>Không có sản phẩm tương tự.</div>
                )}
              </div>
            </div>
          </section>

          <section className="md:col-span-1">
            <div className="lg:col-span-1 truncate  font-montserrat uppercase px-2  hidden lg:flex flex-col gap-4">
              <h3 className="font-bold text-red-500 text-[18px] ">
                Danh mục sản phẩm
              </h3>
              {category.map((item) => (
                <div
                  key={item.id}
                  className={`font-semibold flex items-center gap-2 text-lg hover:scale-105 hover:text-red-500 hover:cursor-pointer  duration-300 ${
                    selectedCategory === item.name ? "text-red-500" : ""
                  }`}
                  onClick={() => handleCategory(item.name)}
                >
                  <MdKeyboardDoubleArrowRight />
                  <div className="truncate whitespace-nowrap text-sm overflow-hidden">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Helmet>
  );
}
