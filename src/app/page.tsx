// 'use client';
import React from "react";
import LeftSideOfPage from "./HomePageComponents/LeftSideOfPage/LeftSideOfPage";
import RightSideOfPage from "./HomePageComponents/RightSideOfPage/RightSideOfPage";

const HomePage = () => {
  return (
    <>
      <div
        className=" h-screen flex justify-center items-center"
        style={{ backgroundColor: "#F2F7F2" }}
      >
        <div className=" h-3/5 w-3/4 flex justify-center  items-center max-sm:h-4/5 max-md:h-2/3 shadow-xl rounded-xl">
          <LeftSideOfPage />
          <RightSideOfPage />
        </div>
      </div>
    </>
  );
};

export default HomePage;
