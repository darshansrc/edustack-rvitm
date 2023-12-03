import React from "react";
import Link from "next/link";
import styles from "./RightSideOfPage.module.css";
import { motion } from "framer-motion";
import LogoAnimation from "./LogoAnimation/LogoAnimation";

const RightSideOfPage = (props) => {
  return (
    <>
      <div className="flex justify-center items-center h-screen w-1/2 max-md:w-screen flex-col">
        <div className="flex flex-col items-center h-auto">
          <motion.div className="mb-[-30px]">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="font-extrabold text-9xl text-[#0577fb] font-poppins"
              style={{
                WebkitTextStroke: "0.5px white",
              }}
            >
              Edu
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3 }}
              className="font-extrabold text-9xl text-[#0577fb] font-poppins"
              style={{
                WebkitTextStroke: "0.5px white",
              }}
            >
              stack
            </motion.span>
          </motion.div>
          <LogoAnimation />
        </div>
        <div className=" flex justify-center items-center w-full p-1 h-auto">
          <div className={styles.pageContainer}>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "bolder",
                margin: "12px",
                fontFamily: "poppins",
                fontVariant: "600",
              }}
            >
              Welcome to EduStack for RVITM
            </h1>
            <p
              className="text-gray-500 font-medium text-base "
              style={{
                fontFamily: "poppins",
              }}
            >
              A Platform Built to Simplify Attendance Tracking & Academics
            </p>
            <div className="flex flex-col">
              <div>
                {/* <Link
                  href="/auth/signin"
                  shallow={true}
                  style={{ width: "95%", fontFamily: "poppins" }}
                > */}
                <button
                  type="button"
                  className="text-white bg-[#1677ff] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium my-2 mx-1 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center "
                  onClick={() => {
                    props.setLoginType("Student");
                    if (window.matchMedia("(min-width: 768px)").matches) {
                      props.setShowSide("bothSides");
                    } else {
                      props.setShowSide("leftSide");
                    }
                  }}
                >
                  <svg
                    className="max-md:hidden transform rotate-180 w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                  <span className="max-md:hidden">&nbsp;&nbsp;</span>
                  <span className="max-[402px]:hidden">Sign In As</span>
                  &nbsp;Student
                  <span className="hidden max-[402px]:block max-[336px]:hidden">
                    &nbsp;Log in
                  </span>
                  <svg
                    className="hidden max-md:block rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
                {/* </Link> */}
                {/* <Link
                  href="/auth/signin"
                  shallow={true}
                  style={{ width: "95%", fontFamily: "poppins" }}
                > */}
                <button
                  type="button"
                  className="text-white bg-[#1677ff] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium my-2 mx-1 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center "
                  onClick={() => {
                    props.setLoginType("Parent");
                    if (window.matchMedia("(min-width: 768px)").matches) {
                      props.setShowSide("bothSides");
                    } else {
                      props.setShowSide("leftSide");
                    }
                  }}
                >
                  <svg
                    className="max-md:hidden transform rotate-180 w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                  <span className="max-md:hidden">&nbsp;&nbsp;</span>
                  <span className="max-[402px]:hidden">Sign In As</span>
                  &nbsp;Parent
                  <span className="hidden max-[402px]:block max-[336px]:hidden">
                    &nbsp;Log in
                  </span>
                  <svg
                    className="hidden max-md:block rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
                {/* </Link> */}
              </div>
              <div>
                {/* <Link
                  href="/auth/signin"
                  shallow={true}
                  style={{ width: "95%", fontFamily: "poppins" }}
                > */}
                <button
                  type="button"
                  className="text-white bg-[#1677ff] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium my-2 mx-1 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center "
                  onClick={() => {
                    props.setLoginType("Faculty");
                    if (window.matchMedia("(min-width: 768px)").matches) {
                      props.setShowSide("bothSides");
                    } else {
                      props.setShowSide("leftSide");
                    }
                  }}
                >
                  <svg
                    className="max-md:hidden transform rotate-180 w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                  <span className="max-md:hidden">&nbsp;&nbsp;</span>
                  <span className="max-[402px]:hidden">Sign In As</span>
                  &nbsp;Faculty
                  <span className="hidden max-[402px]:block max-[336px]:hidden">
                    &nbsp;Log in
                  </span>
                  <svg
                    className="hidden max-md:block rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
                {/* </Link> */}
                <Link
                  href="https://dev.edu-stack.com/auth/admin"
                  shallow={true}
                  style={{ width: "95%", fontFamily: "poppins" }}
                >
                  <button
                    type="button"
                    className="text-white bg-[#1677ff] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium my-2 mx-1 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center "
                  >
                    <svg
                      className="max-md:hidden transform rotate-180 w-3.5 h-3.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                    <span className="max-md:hidden">&nbsp;&nbsp;</span>
                    <span className="max-[402px]:hidden">Sign In As</span>
                    &nbsp;Admin
                    <span className="hidden max-[402px]:block max-[336px]:hidden">
                      &nbsp;Log in
                    </span>
                    <svg
                      className="hidden max-md:block rtl:rotate-180 w-3.5 h-3.5 ms-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
              <Link
                href="/auth/activate-account"
                shallow={true}
                style={{ width: "95%", fontFamily: "poppins" }}
              >
                <button
                  type="button"
                  className="text-white bg-[#1677ff] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium my-2 mx-1 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center "
                >
                  Activate your Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSideOfPage;
