import React from "react";

const LeftSideOfPage = () => {
  return (
    <>
      <div
        className=" h-full w-1/2 rounded-l-xl max-sm:hidden "
        style={{
          backgroundImage: "url(/Images/BGHome.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
    </>
  );
};

export default LeftSideOfPage;
