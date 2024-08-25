import React, { useState } from "react";
import Logo from "../assets/images/logo.jpg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navTitle = [
    { title: "Trang chủ", href: "/" },
    { title: "Giới thiệu", href: "/introduce" },
    { title: "Sản phẩm", href: "/product-list" },
    { title: "Liên hệ", href: "/contact" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full h-auto">
      <div className="relative flex items-center justify-between px-4 py-2 md:px-[100px]">
        <a href="/" className="flex items-center">
          <img
            src={Logo}
            alt="Logo"
            className="w-16 h-16 md:w-[100px] md:h-[100px]"
          />
        </a>

        <button className="block lg:hidden text-red-600" onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        {/* Điều chỉnh menu để nó nằm dưới nút hamburger và chiếm toàn bộ màn hình */}
        <nav
          className={`fixed inset-0 bg-red-500 z-50 text-white rounded-lg shadow-lg ${
            isMenuOpen ? "block" : "hidden"
          } lg:block lg:static lg:inset-auto lg:w-auto lg:bg-transparent lg:text-red-600 lg:shadow-none`}
        >
          {/* Nút đóng */}
          <button
            className="absolute top-4 right-4 text-white text-2xl lg:hidden"
            onClick={toggleMenu}
          >
            &times;
          </button>
          <ul className="flex flex-col items-center justify-center h-full lg:flex-row lg:space-x-6">
            {navTitle.map((item, index) => (
              <li key={index} className="mb-2 lg:mb-0">
                <a
                  href={item.href}
                  className="block hover:text-white font-montserrat hover:bg-red-600 duration-300 rounded-lg p-3 text-base"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
