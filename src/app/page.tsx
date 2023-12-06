"use client";
import React, { useState } from "react";
import styles from "./HomePage.module.css";
import LeftSideOfPage from "./HomePageComponents/LeftSideOfPage/LeftSideOfPage";
import RightSideOfPage from "./HomePageComponents/RightSideOfPage/RightSideOfPage";

const HomePage = () => {
  const [loginType, setLoginType] = useState("Student");
  const [showSide, setShowSide] = useState("bothSides");
  return (
    <>
      <div className="bg-white h-screen overflow-hidden font-poppins">
        <div className=" relative flex justify-center items-center z-[0]">
          {/* max-sm:hidden for hiding pills in mobile view*/}
          {/* for Eg: <div className={`${styles.pill1} max-sm:hidden`}></div> */}
          <div className={`${styles.pill1}`}></div>
          <div className={`${styles.pill2}`}></div>
          <div className={`${styles.pill3}`}></div>
          <div className={`${styles.pill4}`}></div>
          {(showSide === "bothSides" || showSide === "leftSide") && (
            <LeftSideOfPage
              loginType={loginType}
              setShowSide={setShowSide}
              showSide={showSide}
            />
          )}
          {(showSide === "bothSides" || showSide === "rightSide") && (
            <RightSideOfPage
              setLoginType={setLoginType}
              showSide={showSide}
              setShowSide={setShowSide}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
