"use client";
import React from "react";
import styles from "./HomePage.module.css";
import LeftSideOfPage from "./HomePageComponents/LeftSideOfPage/LeftSideOfPage";
import RightSideOfPage from "./HomePageComponents/RightSideOfPage/RightSideOfPage";
// import backgroundImageHome from "../../public/backgroundImages/bg1.jpg";

const HomePage = () => {
  return (
    <>
      <div
        className="flex justify-center items-center relative overflow-hidden"
        style={{
          height: "100svh",
          // backgroundImage: `url(/backgroundImages/bg4.jpg)`,
          // backgroundPosition: "center",
          // backgroundSize: "cover",
          // backgroundRepeat: "no-repeat",
        }}
      >
        <div className={`${styles.pill1} max-[808px]:hidden`}></div>
        <div className={`${styles.pill2} max-[808px]:hidden`}></div>
        <div className={`${styles.pill3} max-[808px]:hidden`}></div>
        <div className={`${styles.pill4} max-[808px]:hidden`}></div>
        <div className=" relative flex justify-center items-center h-screen w-screen flex-col">
          <LeftSideOfPage />
          <RightSideOfPage />
        </div>
      </div>
    </>
  );
};

export default HomePage;
