import React, { useEffect, useState } from "react";
import { CiMap, CiPhone, CiMail } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import BackGround from "../assets/images/eyn0-bg-dvc.jpg";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Footer() {
  const [companyInfo, setCompanyInfo] = useState({
    address: "",
    email: "",
    phone: "",
    hotline: "",
  });
  const [category, setCategory] = useState([]);

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

    const fetchCategory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "category"));
        const nameCategory = [];
        querySnapshot.forEach((doc) => {
          nameCategory.push({ id: doc.id, ...doc.data() });
        });
        setCategory(nameCategory);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchCompanyInfo();
    fetchCategory();
  }, []);

  return (
    <footer
      className="w-full h-auto bg-cover bg-center bg-no-repeat relative text-white"
      style={{ backgroundImage: `url(${BackGround})` }}
    >
      <div className="p-4 md:px-[100px] md:py-[45px] bg-black bg-opacity-50">
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4">
          {/* Thông tin công ty */}
          <div className="flex flex-col gap-4">
            <h3 className="font-montserrat font-bold text-2xl">
              Công ty TNHH Cơ Khí Bảo Khang
            </h3>
            <ul className="flex flex-col gap-2 font-montserrat">
              <li className="flex items-start gap-2">
                <CiMap size={24} />
                <span>{companyInfo.address || "Đang cập nhật..."}</span>
              </li>
              <li className="flex items-center gap-2">
                <CiPhone size={24} />
                <span>{companyInfo.phone || "Đang cập nhật..."}</span>
              </li>
              <li className="flex items-start gap-2">
                <CiMail size={24} />
                <span>{companyInfo.email || "Đang cập nhật..."}</span>
              </li>
            </ul>
          </div>

          {/* Danh mục sản phẩm */}
          <div className="flex flex-col gap-4">
            <h3 className="font-montserrat font-bold text-2xl">
              Danh mục sản phẩm
            </h3>
            <ul className="font-montserrat flex flex-col gap-2">
              {category.length > 0 ? (
                category
                  .slice(0, 5)
                  .map((item) => <li key={item.id}>{item.name}</li>)
              ) : (
                <li>Đang cập nhật...</li>
              )}
            </ul>
          </div>

          {/* Thông tin */}

          {/* Hỗ trợ */}
          <div className="flex flex-col gap-4">
            <h3 className="font-montserrat font-bold text-2xl">Hỗ trợ</h3>
            <ul className="flex flex-col gap-2 font-montserrat">
              <li>
                Mọi thắc mắc và góp ý cần hỗ trợ xin vui lòng liên hệ Fanpage
              </li>
              <li>
                <a
                  href="https://www.facebook.com/co.khi.bao.khang"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
