/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import css
import Banner1 from "../assets/images/img1.jpg";
import Banner2 from "../assets/images/img2.jpg";
import Logo from "../assets/images/logo.jpg";
import BackGround from "../assets/images/bg1.jpg";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const introduction = [
    { info: "50", title: "Dự án" },
    { info: "90", title: "Khách hàng" },
    { info: "75", title: "Sản phẩm" },
  ];

  const [products, setProduct] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      // Fetch dữ liệu sản phẩm
      const querySnapshot = await getDocs(collection(db, "product"));
      const profiles = [];
      querySnapshot.forEach((doc) => {
        profiles.push({ id: doc.id, ...doc.data() });
      });
      setProduct(profiles);

      // Sau 3 giây, hiển thị toàn bộ nội dung
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    fetchData();
  }, []);

  const handleProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleIntroduction = () => {
    navigate("/introduce");
  };
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    content: "",
  });
  const [formStatus, setFormStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "contactMessages", new Date().toISOString()), {
        ...formData,
        timestamp: new Date(),
      });
      setFormStatus("Cảm ơn bạn đã liên hệ với chúng tôi!");
      setFormData({
        name: "",
        phone: "",
        email: "",
        content: "",
      });
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      setFormStatus("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading className="animate-spin text-5xl text-red-500" />
      </div>
    ); // Hiển thị icon loading khi đang chờ
  }
  return (
    <div className="w-full h-auto bg-white">
      {/* Background */}
      <section className="md:h-[700px] h-[200px]">
        <section className="md:h-[700px] h-[200px]">
          <Carousel
            showArrows={false}
            showThumbs={false}
            infiniteLoop={true}
            showStatus={false}
            autoPlay={true}
            interval={3000}
            className="w-full md:h-[700px] h-[200px]"
            showIndicators={false}
          >
            <div className="md:h-[700px]">
              <img
                src={Banner1}
                alt="slide1"
                className="w-full md:h-[700px] h-[200px] object-cover"
              />
            </div>
            <div className="md:h-[700px]">
              <img
                src={Banner2}
                alt="slide2"
                className="w-full md:h-[700px] h-[200px] object-cover"
              />
            </div>
          </Carousel>
        </section>
      </section>
      <section className="flex md:flex-row w-full md:px-[100px] my-4 gap-6 flex-col items-center">
        <div className="md:w-1/2 flex items-center justify-center">
          <img src={Logo} alt="" className=" w-3/5 shadow-lg" />
        </div>
        <div className="md:w-1/2 flex flex-col px-4 items-center md:items-start justify-center font-montserrat gap-10">
          <h1 className="font-bold md:text-[33px] text-[18px]">
            Công ty TNHH Cơ Khí Bảo Khang
          </h1>
          <span className="md:text-[25px] text-[16px]">
            Công ty TNHH Cơ Khí Bảo Khang, với hơn 10 năm kinh nghiệm trong
            ngành cơ khí, chuyên cung cấp các giải pháp kỹ thuật và sản phẩm
            chất lượng cao, cam kết mang đến dịch vụ tận tâm và sản phẩm bền bỉ,
            đáp ứng nhu cầu đa dạng của khách hàng.
          </span>
          <button
            onClick={handleIntroduction}
            className="md:text-[20px] text-[14px] uppercase font-medium border px-4 py-2 bg-red-500 text-white hover:bg-white duration-300 hover:text-red-500 hover:border-red-500"
          >
            Xem thêm
          </button>
        </div>
      </section>
      <section className="relative w-full my-4 shadow-lg ">
        <div className="relative w-full ">
          <img
            src={BackGround}
            alt=""
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 flex flex-col gap-10 hover:cursor-default justify-center items-center text-white bg-black bg-opacity-10">
            <h1 className=" font-montserrat text-[40px] md:block hidden font-bold uppercase text-red-500">
              Con số nổi bật
            </h1>

            <div className="flex md:flex-row flex-col gap-10 hover:cursor-default w-full justify-center px-[100px]">
              {introduction.map((item, index) => (
                <div
                  key={index}
                  className="font-montserrat text-center flex flex-col gap-6 w-full max-w-md px-4 md:py-6 py-3 border border-white rounded-lg bg-black bg-opacity-60 shadow-lg transition-transform transform hover:scale-105 hover:bg-opacity-70"
                >
                  <div className="md:text-[50px] text-base font-extrabold leading-tight transition-transform transform hover:scale-110">
                    {item.info}+
                  </div>
                  <div className="md:text-3xl text-base font-semibold transition-transform transform hover:scale-105">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="my-4 w-full flex flex-col items-center">
        <h1 className="font-lg font-montserrat md:text-[40px] mb-4 font-bold uppercase text-red-500">
          Sản phẩm
        </h1>
        <div className="grid md:grid-cols-3 grid-cols-2 md:w-2/3 w-full gap-10 px-4 md:px-[100px] h-auto">
          {products.slice(0, 6).map((item, index) => (
            <div
              className="relative font-montserrat uppercase border flex flex-col items-center justify-center group transition-transform duration-500 ease-linear transform hover:scale-105"
              key={index}
            >
              <img
                src={item.Image}
                alt={item.title}
                className="w-full h-[200px] object-cover transition-transform duration-500 ease-linear" // Set fixed height and maintain aspect ratio
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                <button
                  onClick={() => handleProduct(item.id)}
                  className="text-white bg-red-500 px-4 py-2 hover:text-red-500 hover:bg-white transition-colors duration-300"
                >
                  Xem thêm
                </button>
              </div>
              <span className="md:my-4 my-2 text-center md:text-[16px] text-[12px] truncate">
                {item.Name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="my-4">
        <div className="my-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1862.4263904455945!2d105.8126686392814!3d20.99853765667463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac9085f43493%3A0x4aa558eb2ca66825!2zTmfDtSAxODEgxJDGsOG7nW5nIE5ndXnhu4VuIFRyw6NpLCBUaMaw4bujbmcgxJDDrG5oLCBUaGFuaCBYdcOibiwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1721679034675!5m2!1svi!2s"
            width="600"
            height="450"
            style={{ border: "0" }} // Sử dụng đối tượng JavaScript thay vì chuỗi
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[300px]"
          />
        </div>
      </section>

      <section className="flex flex-col w-full items-center my-4 justify-center">
        <h1 className="font-montserrat text-lg md:text-[40px] mb-4 font-bold uppercase text-red-500">
          tư vấn ngay
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 md:gap-8 w-4/5 mx-auto shadow-lg p-8 bg-white rounded-lg"
        >
          <div className="flex md:flex-row flex-col gap-4  md:gap-8 items-center justify-center">
            <div className="flex-1 w-full">
              <input
                className="border border-gray-300 rounded-lg font-montserrat p-3 w-full focus:border-red-500 focus:outline-none transition-colors duration-300"
                placeholder="Họ và tên"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-1 w-full ">
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg font-montserrat p-3 w-full focus:border-red-500 focus:outline-none transition-colors duration-300"
                placeholder="Email"
              />
            </div>
            <div className="flex-1 w-full">
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg font-montserrat p-3 w-full focus:border-red-500 focus:outline-none transition-colors duration-300"
                placeholder="Số điện thoại"
              />
            </div>
          </div>
          <div className="w-full">
            <input
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none font-montserrat p-3 w-full transition-colors duration-300"
              placeholder="Nội dung"
            />
          </div>
          <button className="w-full border border-red-500 p-2 font-montserrat uppercase text-red-500 font-semibold hover:bg-red-500 rounded-lg hover:text-white duration-300">
            Liên hệ
          </button>
          {formStatus && <div className="text-red-500 mt-4">{formStatus}</div>}
        </form>
      </section>
    </div>
  );
}
