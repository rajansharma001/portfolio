"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
const defaultImg =
  "https://images.unsplash.com/photo-1706879350832-db2615866e54";
const menu = [
  {
    id: "1",
    name: "about",
    onHover: "https://images.unsplash.com/photo-1575936123452-b67c3203c357",
    link: "/about",
  },
  {
    id: "2",
    name: "projects",
    onHover: "https://images.unsplash.com/photo-1761839257664-ecba169506c1",
    link: "/projects",
  },
  {
    id: "3",
    name: "experience",
    onHover: "https://images.unsplash.com/photo-1756994701565-0bc93c34eebe",
    link: "/experience",
  },
  {
    id: "4",
    name: "blogs",
    onHover: "https://images.unsplash.com/photo-1761839257864-c6ccab7238de",
    link: "/blogs",
  },
  {
    id: "5",
    name: "contact",
    onHover: "https://images.unsplash.com/photo-1761839257287-3030c9300ece",
    link: "/contact",
  },
];
const Sidebar = () => {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {isOpen ? (
        <div
          className={`bg-black absolute flex items-center justify-center  right-0  bg-opacity-50 z-0 h-screen py-10 transform transition-all duration-300 ease-in  ${isOpen ? " w-full " : " -translate-x-50 "} `}
        >
          <div className="absolute z-50 top-10 right-10 flex justify-end">
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>
          <ul className="text-4xl font-bold uppercase  flex flex-col items-center justify-around gap-35 ">
            {menu.map((nav, idex) => (
              <Link
                key={idex}
                href={nav.link}
                onMouseOver={() => {
                  setActive(true);
                  setIndex(idex);
                }}
                onMouseOut={() => {
                  setActive(false);
                  setIndex(-1);
                }}
                className="relative"
              >
                {active && idex === index ? (
                  <div className="absolute -top-20 -left-30  w-62.5 flex items-center justify-center transform translate ease-in-out duration-300 z-10 ">
                    <Image
                      alt="navImg"
                      src={nav.onHover || defaultImg}
                      className="rounded-3xl mb-5 w-550  object-cover backdrop:drop-shadow-2xl shadow-2xl shadow-black"
                      width={720}
                      height={480}
                    />
                    <h1 className="absolute z-10 top-18 left-0 right-0 flex justify-center items-center text-stroke  font-stretch-100%">
                      {nav.name}
                    </h1>
                  </div>
                ) : (
                  <li>
                    <h1 className="text-stroke  font-stretch-100%">
                      {nav.name}
                    </h1>
                  </li>
                )}
              </Link>
            ))}
          </ul>
        </div>
      ) : (
        <div className="absolute top-10 right-10  justify-end  lg:hidden md:flex flex">
          <button onClick={() => setIsOpen(true)}>
            <Menu />
          </button>
          <ul className="text-4xl font-bold uppercase   flex-col items-center justify-around gap-35 hidden md:flex lg:flex ">
            {menu.map((nav, idex) => (
              <Link
                key={idex}
                href={nav.link}
                onMouseOver={() => {
                  setActive(true);
                  setIndex(idex);
                }}
                onMouseOut={() => {
                  setActive(false);
                  setIndex(-1);
                }}
                className="relative"
              >
                {active && idex === index ? (
                  <div className="absolute -top-20 -left-30  w-62.5 flex items-center justify-center transform translate ease-in-out duration-300 z-10 ">
                    <Image
                      alt="navImg"
                      src={nav.onHover || defaultImg}
                      className="rounded-3xl mb-5 w-550  object-cover backdrop:drop-shadow-2xl shadow-2xl shadow-black"
                      width={720}
                      height={480}
                    />
                    <h1 className="absolute z-10 top-18 left-0 right-0 flex justify-center items-center text-stroke  font-stretch-100%">
                      {nav.name}
                    </h1>
                  </div>
                ) : (
                  <li>
                    <h1 className="text-stroke  font-stretch-100%">
                      {nav.name}
                    </h1>
                  </li>
                )}
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
