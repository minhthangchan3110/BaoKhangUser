import React, { useEffect, useState } from "react";
import BackGround from "../assets/images/bg1.jpg";
import { IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { AiOutlineLoading } from "react-icons/ai"; // Import icon loading

export default function Introduce() {
  const [introduceProfile, setIntroduceProfile] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái để theo dõi quá trình load

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const profiles = [];
    querySnapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    setIntroduceProfile(profiles);
    setTimeout(() => {
      setLoading(false); // Sau 3 giây, ẩn loading và hiển thị nội dung
    }, 2000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`/contentblog/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading className="animate-spin text-5xl text-red-500" />
      </div>
    ); // Hiển thị icon loading khi đang chờ
  }

  return (
    <div className="w-full h-auto hover:cursor-pointer">
      <section className="relative w-full my-4 h-auto shadow-lg ">
        <div className="relative w-full ">
          <img
            src={BackGround}
            alt=""
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute inset-0 flex flex-col gap-5 hover:cursor-default justify-center items-center text-white bg-black bg-opacity-10">
            <h1 className="font-montserrat text-[40px] font-bold uppercase text-red-500">
              Giới thiệu
            </h1>
            <span className="flex items-center md:text-[24px] text-[14px] justify-center font-montserrat gap-2 text-red-500">
              Trang chủ <IoIosArrowForward /> Giới thiệu
            </span>
          </div>
        </div>
      </section>
      <section className="my-4 md:grid md:grid-cols-4 w-full md:px-[100px] px-4 gap-6">
        <div className="col-span-1 truncate border font-montserrat uppercase shadow-lg px-2 py-6 hidden md:flex flex-col gap-4">
          <h3 className="font-bold text-red-500 text-[18px] text-center">
            Giới thiệu
          </h3>
          {introduceProfile.map((item) => (
            <div
              key={item.id}
              className="font-semibold flex items-center gap-2 text-lg hover:scale-105 hover:text-red-500 hover:cursor-pointer px-4 duration-300"
              onClick={() => handleNavigate(item.id)}
            >
              <div>
                <MdKeyboardDoubleArrowRight />
              </div>
              <div className="truncate whitespace-nowrap overflow-hidden">
                {item.title}
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-3 w-full">
          <div className="md:grid md:grid-cols-3 flex w-full flex-col justify-center items-center gap-4">
            {introduceProfile.map((item) => (
              <div
                className="md:col-span-1 w-full font-montserrat shadow-lg hover:scale-105 duration-300 overflow-hidden" // Thêm rounded-lg và overflow-hidden
                key={item.id}
                onClick={() => handleNavigate(item.id)}
              >
                <div className="w-full h-[300px] relative">
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src={item.coverImage}
                    alt={item.title}
                  />
                </div>
                <div className="px-4 flex flex-col gap-2 py-4">
                  <div className="font-semibold text-lg hover:text-red-500 cursor-pointer">
                    {item.title}
                  </div>
                  <div className="line-clamp-2 text-sm text-gray-600">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
