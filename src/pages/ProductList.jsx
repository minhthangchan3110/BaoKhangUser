import { collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import BackGround from "../assets/images/bg1.jpg";
import { IoIosArrowForward } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
export default function ProductList() {
  const { id } = useParams();
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
  };

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProduct(
        product.filter((item) => item.Category === selectedCategory)
      );
    } else {
      setFilteredProduct(product);
    }
  }, [selectedCategory, product]);
  useEffect(() => {
    const fetchCategory = async () => {
      const querySnapshot = await getDocs(collection(db, "category"));
      const nameCategory = [];
      querySnapshot.forEach((doc) => {
        nameCategory.push({ id: doc.id, ...doc.data() });
      });
      setCategory(nameCategory);
    };

    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "product"));
      const profiles = [];
      querySnapshot.forEach((doc) => {
        profiles.push({ id: doc.id, ...doc.data() });
      });
      setProduct(profiles);
      setFilteredProduct(profiles);
    };
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    fetchCategory();
    fetchProducts();
  }, [id]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProduct(
        product.filter((item) => item.Category === selectedCategory)
      );
    } else {
      setFilteredProduct(product);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [selectedCategory, product]);

  // Tính toán các sản phẩm cần hiển thị cho trang hiện tại
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProduct.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Xử lý điều hướng giữa các trang
  const totalPages = Math.ceil(filteredProduct.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading className="animate-spin text-5xl text-red-500" />
      </div>
    ); // Hiển thị icon loading khi đang chờ
  }
  return (
    <div className="font-montserrat w-full h-auto">
      <section className="relative w-full my-4 h-auto shadow-lg">
        <div className="relative w-full">
          <img
            src={BackGround}
            alt=""
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute inset-0 flex flex-col gap-5 hover:cursor-default justify-center items-center text-white bg-black bg-opacity-10">
            <h1 className="font-montserrat md:text-[40px] font-bold uppercase text-red-500">
              Sản phẩm
            </h1>
            <span className="flex items-center justify-center font-montserrat gap-2 text-red-500">
              <a
                href="/"
                className="hover:text-red-800 md:text-[24px] text-[14px] duration-300"
              >
                Trang chủ
              </a>{" "}
              <IoIosArrowForward />
              <a
                href="/product-list"
                className="hover:text-red-800 md:text-[24px] text-[14px] duration-300"
              >
                Sản phẩm
              </a>{" "}
            </span>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-5 lg:px-[100px] py-2 gap-4">
        <div className="lg:col-span-1 truncate border font-montserrat uppercase shadow-lg px-2 py-6 hidden lg:flex flex-col gap-4">
          <h3 className="font-bold text-red-500 text-[18px] text-center">
            Danh mục sản phẩm
          </h3>
          {category.map((item) => (
            <div
              key={item.id}
              className={`font-semibold flex items-center gap-2 text-lg hover:scale-105 hover:text-red-500 hover:cursor-pointer px-4 duration-300 ${
                selectedCategory === item.name ? "text-red-500" : ""
              }`}
              onClick={() => setSelectedCategory(item.name)}
            >
              <div className="truncate whitespace-nowrap text-sm overflow-hidden">
                {item.name}
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-4 col-span-5 w-full px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-4 justify-center items-center">
            {currentProducts.map((item) => (
              <div
                className="col-span-1 w-full font-montserrat shadow-lg hover:scale-105 duration-300 overflow-hidden"
                key={item.id}
                onClick={() => handleNavigate(item.id)}
              >
                <div className="w-full lg:h-[300px] h-[150px] relative">
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src={item.Image}
                    alt={item.title}
                  />
                </div>
                <div className="px-4 flex flex-col gap-2 py-4">
                  <div
                    className="font-semibold text-lg hover:text-red-500 cursor-pointer overflow-hidden text-ellipsis"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.Name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center my-4 gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === index + 1
                    ? "bg-red-500 text-white"
                    : "bg-white text-red-500"
                } hover:bg-red-600 hover:text-white`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
