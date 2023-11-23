"use client";
import React from "react";
import styles from "./HomePage.module.css";
import LeftSideOfPage from "./HomePageComponents/LeftSideOfPage/LeftSideOfPage";
import RightSideOfPage from "./HomePageComponents/RightSideOfPage/RightSideOfPage";

const HomePage = () => {
  return (
    <>
      <div
        className="flex justify-center items-center relative overflow-hidden bg-white"
        style={{ height: "100svh" }}
      >
        <div className={`${styles.pill1} max-[808px]:hidden`}></div>
        <div className={`${styles.pill2} max-[808px]:hidden`}></div>
        <div className={`${styles.pill3} max-[808px]:hidden`}></div>
        <div className={`${styles.pill4} max-[808px]:hidden`}></div>
        <div className=" h-3/5 w-3/4 relative flex justify-center items-center max-[900px]:h-screen max-[900px]:w-screen max-[900px]:flex-col">
          <LeftSideOfPage />
          <RightSideOfPage />
        </div>
      </div>
    </>
  );
};

export default HomePage;
