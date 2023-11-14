"use client";
import React from "react";
import styles from "./HomePage.module.css";
import LeftSideOfPage from "./HomePageComponents/LeftSideOfPage/LeftSideOfPage";
import RightSideOfPage from "./HomePageComponents/RightSideOfPage/RightSideOfPage";

const HomePage = () => {
  return (
    <>
      <div className="h-screen flex justify-center items-center relative overflow-hidden">
        <div className={styles.pill1}></div>
        <div className={styles.pill2}></div>
        <div className={styles.pill3}></div>
        <div className={styles.pill4}></div>
        <div className=" h-3/5 w-3/4 relative flex justify-center items-center max-md:h-2/3 max-sm:h-screen max-sm:w-screen max-sm:flex-col">
          <LeftSideOfPage />
          <RightSideOfPage />
        </div>
      </div>
    </>
  );
};

export default HomePage;
