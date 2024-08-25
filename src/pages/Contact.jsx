/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from "react";
import BackGround from "../assets/images/bg1.jpg";
import { IoIosArrowForward } from "react-icons/io";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AiOutlineLoading } from "react-icons/ai";
export default function Contact() {
  const [companyInfo, setCompanyInfo] = useState({
    mst: "",
    address: "",
    email: "",
    phone: "",
    hotline: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    content: "",
  });

  const [formStatus, setFormStatus] = useState("");

  const infoName = [
    { name: "MST", key: "mst" },
    { name: "Địa chỉ", key: "address" },
    { name: "Email", key: "email" },
    { name: "Điện thoại", key: "phone" },
    { name: "Hotline", key: "hotline" },
  ];
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const docRef = doc(db, "companyInfo", "info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompanyInfo(docSnap.data());
        } else {
          console.log("Không tìm thấy tài liệu!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    fetchCompanyInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "contactMessages", new Date().toISOString()), {
        ...formData,
        timestamp: new Date(), // Thêm trường timestamp với giá trị hiện tại
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading className="animate-spin text-5xl text-red-500" />
      </div>
    ); // Hiển thị icon loading khi đang chờ
  }
  return (
    <div className="font-montserrat w-full h-auto py-2">
      <section className="relative w-full my-4 h-auto shadow-lg">
        <div className="relative w-full">
          <img
            src={BackGround}
            alt=""
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute inset-0 flex flex-col gap-5 hover:cursor-default justify-center items-center text-white bg-black bg-opacity-10">
            <h1 className="font-montserrat md:text-[40px] font-bold uppercase text-red-500">
              Liên hệ
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
                href="/contact"
                className="hover:text-red-800 md:text-[24px] text-[14px] duration-300"
              >
                Liên hệ
              </a>{" "}
            </span>
          </div>
        </div>
      </section>
      <section className="w-full md:flex md:px-[100px] px-10">
        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="text-red-500 text-2xl">
            Công ty TNHH Cơ Khí Bảo Khang
          </div>
          {infoName.map((item, index) => (
            <div key={index} className="flex gap-2">
              <div className="font-bold md:text-[16px] text-[14px]">
                {item.name}:
              </div>
              <div className="md:text-[16px] text-[14px]">
                {companyInfo[item.key]}
              </div>
            </div>
          ))}
        </div>
        <div className="md:w-1/2 pt-4 md:pt-0">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <div className="italic text-xs">
              Xin vui lòng để lại địa chỉ email, chúng tôi sẽ cập nhật những tin
              tức quan trọng của chúng tôi tới quý khách.
            </div>
            <div className="w-full flex flex-row gap-2">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border-gray-500 md:text-[16px] text-[14px] rounded-lg p-2 border w-1/2"
                placeholder="Tên*"
                required
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border-gray-500 md:text-[16px] text-[14px] rounded-lg p-2 border w-1/2"
                placeholder="Số điện thoại*"
                required
              />
            </div>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-gray-500 md:text-[16px] text-[14px] rounded-lg p-2 border w-full"
              placeholder="Email*"
              required
            />
            <input
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="border-gray-500 md:text-[16px] text-[14px] rounded-lg px-2 py-6 border w-full"
              placeholder="Nội dung*"
              required
            />
            <div className="italic text-xs">Các mục có (*) là bắt buộc.</div>
            <button
              type="submit"
              className="w-full py-4 text-white rounded-lg bg-red-500 hover:bg-red-600"
            >
              Gửi
            </button>
            {formStatus && (
              <div className="text-red-500 mt-4">{formStatus}</div>
            )}
          </form>
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
    </div>
  );
}
