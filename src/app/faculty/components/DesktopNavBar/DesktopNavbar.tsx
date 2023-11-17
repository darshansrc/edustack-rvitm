"use client";

import React, { useEffect } from "react";
import { BsFillPeopleFill, BsPeople, BsStack } from "react-icons/bs";
import { HiDocumentText } from "react-icons/hi";
import { IoCalendarNumber } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

const DesktopNavbar = () => {
  const [subMenuActive, setSubMenuActive] = React.useState<boolean>(false);
  const pathname = usePathname() || "";

  useEffect(() => {
    pathname.startsWith("/faculty/attendance") && setSubMenuActive(true);
  }, []);

  return (
    <div>
      <aside className="fixed select-none font-[Poppins] h-screen z-40 w-52 hidden md:block bg-white border-r border-gray-50 top-0 left-0 transition-transform -translate-x-full sm:translate-x-0">
        <div className="overflow-y-auto py-5 px-3 h-full bg-white  ">
          <div className="flex w-full flex-row mb-4  items-center gap-2 font-semibold justify-center">
            <BsStack className="w-6 h-6 text-blue-600" />
            <p className="text-gray-900 pr-2"> Edustack </p>
          </div>

          <ul className="space-y-2 border-t border-gray-50 border-solid">
            <li className="mt-4">
              <Link href={"/faculty/home"} passHref>
                <div
                  className={`cursor-pointer flex items-center p-2 text-sm font-normal rounded-lg  ${
                    pathname === "/faculty/home"
                      ? "bg-blue-600 text-gray-50 hover:none"
                      : "text-gray-900 hover:bg-gray-50 group"
                  }`}
                >
                  <AiFillHome
                    className={`w-4 h-4 ${
                      pathname === "/faculty/home"
                        ? "text-gray-50"
                        : "text-gray-400 group-hover:text-gray-900"
                    } transition duration-75`}
                  />
                  <span className="ml-3 text-sm">Home</span>
                </div>
              </Link>
            </li>

            <li>
              <div
                onClick={() =>
                  subMenuActive
                    ? setSubMenuActive(false)
                    : setSubMenuActive(true)
                }
                className={`cursor-pointer flex items-center p-2 text-sm font-normal rounded-lg  group-hover:text-gray-900 hover:bg-gray-50 group'  ${
                  pathname.startsWith("/faculty/attendance") ? "" : ""
                }`}
              >
                <BsFillPeopleFill className="w-4 h-4 text-gray-400  " />
                <span className="ml-3 text-sm">Attendance</span>
                <IoIosArrowDown className="w-4 h-4 ml-8 text-gray-400  group-hover:text-gray-900" />
              </div>

              {subMenuActive && (
                <ul id="dropdown-pages" className="py-2 space-y-2">
                  <li>
                    <Link href={"/faculty/attendance"} passHref>
                      <div
                        className={`cursor-pointer select-none flex items-center px-2 py-1 pl-11 w-full text-xs font-normal rounded-lg  group  ${
                          pathname === "/faculty/attendance"
                            ? "bg-blue-600 text-gray-50 hover:none"
                            : "text-gray-900 hover:bg-gray-50 group"
                        }`}
                      >
                        View Attendance
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href={"/faculty/attendance/attendance-form"} passHref>
                      <div
                        className={`cursor-pointer select-none flex items-center px-2 py-1 pl-11 w-full text-xs font-normal rounded-lg  group  ${
                          pathname === "/faculty/attendance/attendance-form"
                            ? "bg-blue-600 text-gray-50 hover:none"
                            : "text-gray-900 hover:bg-gray-50 group"
                        }`}
                      >
                        Mark Attendance
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/faculty/attendance/export-attendance"}
                      passHref
                    >
                      <div
                        className={`cursor-pointer select-none flex items-center px-2 py-1 pl-11 w-full text-xs font-normal rounded-lg  group  ${
                          pathname === "/faculty/attendance/export-attendance"
                            ? "bg-blue-600 text-gray-50 hover:none"
                            : "text-gray-900 hover:bg-gray-50 group"
                        }`}
                      >
                        Export Attendance
                      </div>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link href={"/faculty/schedule"} passHref>
                <div
                  className={`cursor-pointer flex items-center p-2 text-sm font-normal rounded-lg  ${
                    pathname === "/faculty/schedule"
                      ? "bg-blue-600 text-gray-50 hover:none"
                      : "text-gray-900 hover:bg-gray-50 group"
                  }`}
                >
                  <IoCalendarNumber className="w-4 h-4 text-gray-400  group-hover:text-gray-900" />
                  <span className="ml-3 text-sm">Schedule</span>
                </div>
              </Link>
            </li>

            <li>
              <Link href={"/faculty/marks-entry"} passHref>
                <div
                  className={`cursor-pointer flex items-center p-2 text-sm font-normal rounded-lg  ${
                    pathname === "/faculty/marks-entry"
                      ? "bg-blue-600 text-gray-50 hover:none"
                      : "text-gray-900 hover:bg-gray-50 group"
                  }`}
                >
                  <HiDocumentText className="w-4 h-4 text-gray-400  group-hover:text-gray-900" />
                  <span className="ml-3 text-sm">Marks Entry</span>
                </div>
              </Link>
            </li>

            <li>
              <Link href={"/faculty/profile"} passHref>
                <div
                  className={`cursor-pointer flex items-center p-2 text-sm font-normal rounded-lg  ${
                    pathname === "/faculty/profile"
                      ? "bg-blue-600 text-gray-50 hover:none"
                      : "text-gray-900 hover:bg-gray-50 group"
                  }`}
                >
                  <FaCircleUser className="w-4 h-4 text-gray-400  group-hover:text-gray-900" />
                  <span className="ml-3 text-sm">Profile</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default DesktopNavbar;
