import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import BackGround from "../assets/images/bg1.jpg";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai"; // Import icon loading

export default function ContentBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const [introduceProfile, setIntroduceProfile] = useState([]);
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`/contentblog/${id}`);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBlog(data);
          setTitle(data.title);
          setContentBlocks(data.contentBlocks || []);
        } else {
          setError("Không tìm thấy bài viết.");
        }
      } catch (err) {
        setError("Lỗi khi tải bài viết.");
      }
    };

    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const profiles = [];
      querySnapshot.forEach((doc) => {
        profiles.push({ id: doc.id, ...doc.data() });
      });
      setIntroduceProfile(profiles);
    };

    fetchData();
    fetchBlog();
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Sau 3 giây, ẩn loading và hiển thị nội dung
    }, 2000);

    return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading className="animate-spin text-5xl text-red-500" />
      </div>
    );

  if (error) return <div>{error}</div>;

  const formatTextWithLineBreaks = (text) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="font-montserrat py-2">
      <section className="md:block hidden relative w-full my-4 h-auto shadow-lg ">
        <div className="relative w-full ">
          <img
            src={BackGround}
            alt=""
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute inset-0 flex flex-col gap-5 hover:cursor-default justify-center items-center text-white bg-black bg-opacity-10">
            <h1 className="font-montserrat md:text-[40px] font-bold uppercase text-red-500">
              Giới thiệu
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
                href="/introduce"
                className="hover:text-red-800 md:text-[24px] text-[14px] duration-300"
              >
                Giới thiệu
              </a>{" "}
              <IoIosArrowForward />
              <span className="md:text-[24px] text-[14px]">{title}</span>
            </span>
          </div>
        </div>
      </section>
      <section className="md:px-[100px] px-4 grid grid-cols-5 gap-4">
        <div className="lg:col-span-1 border font-montserrat uppercase shadow-lg px-2 py-6 hidden lg:flex flex-col  gap-4">
          <h3 className="font-bold text-red-500 text-[18px] text-center">
            Bài viết liên quan
          </h3>
          {introduceProfile
            .filter((item) => item.id !== id)
            .map((item) => (
              <div key={item.id} onClick={() => handleNavigate(item.id)}>
                <div className="font-semibold flex items-center truncate gap-2 text-sm hover:scale-105 hover:text-red-500 hover:cursor-pointer px-4 duration-300">
                  <div>
                    <MdKeyboardDoubleArrowRight />
                  </div>
                  <div className="truncate whitespace-nowrap overflow-hidden">
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="lg:col-span-4 flex flex-col justify-center col-span-5">
          <h1 className="text-center md:text-3xl mb-4 text-red-500">{title}</h1>
          <div>
            {contentBlocks.map((block, index) => (
              <div key={index} className="mb-4">
                {block.title && (
                  <div className="lg:text-xl text-base text-justify lg:leading-loose font-semibold">
                    {formatTextWithLineBreaks(block.title)}
                  </div>
                )}
                {block.text && (
                  <div className="text-base text-justify lg:leading-9">
                    {formatTextWithLineBreaks(block.text)}
                  </div>
                )}
                {block.image && (
                  <div className="relative mt-2">
                    <img
                      src={block.image}
                      alt={`Content ${index}`}
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
