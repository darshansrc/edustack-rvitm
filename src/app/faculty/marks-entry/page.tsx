import TopNavbar from "@/app/student/components/topnavbar/TopNavbar";
import React from "react";

const page = () => {
  return (
    <>
      <TopNavbar name="Marks Entry" />
      <div className="flex flex-col items-center justify-center w-full h-[100vh]">
        <div className="flex flex-col items-center justify-center w-11/12 max-w-[450px] border border-solid h-[70vh] font-poppins text-center bg-white rounded-lg border-gray-200">
          No Tests held Yet!
        </div>
      </div>
    </>
  );
};

export default page;
