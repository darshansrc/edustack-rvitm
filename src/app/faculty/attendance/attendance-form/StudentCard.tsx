import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { Avatar, Space } from "antd";

export default function StudentCard(props) {
  const attendanceStatus = props.Present
    ? "bg-[#dff0d8] border border-solid border-[#b7eb8f]"
    : "bg-[#f2dede] border border-solid border-[#ffccc7]";
  const slNo = Number(props.USN.toString().replace(/^0+/, "").slice(-3));
  return (
    <div
      className={`flex items-center  py-3 my-2 h-[80px] relative rounded-xl ${attendanceStatus}`}
      onClick={props.toggle}
    >
      <div className="max-w-[12%] w-[12%]  flex justify-center">
        <h6 className="text-[rgba(0, 0, 0, 0.88)]">{slNo + "."}</h6>
      </div>

      <div className="max-w-[15%] w-[15%] min-w-[15%] flex justify-center">
        <Avatar size={50} icon={<UserOutlined />} />
      </div>

      <div className="max-w-[55%] pl-3 w-[55%] min-w-[55%] flex flex-col justify-center">
        <h2
          className="text-[14px] font-[400] font-[Poppins] text-[rgba(0, 0, 0, 0.88)]"
          style={{ textTransform: "capitalize" }}
        >
          {props.Name}
        </h2>
        <p className="text-[12px] text-[#333] font-[Poppins] text-[rgba(0, 0, 0, 0.88)]">
          {props.USN.toString()}
        </p>
      </div>

      <div className="max-w-[10%] pl-3 w-[10%] min-w-[10%] flex flex-col justify-center ">
        {props.Present ? (
          <span className="text-white bg-[green] rounded-[50%] mr-[10px] w-[25px] h-[25px] flex items-center justify-center">
            P
          </span>
        ) : (
          <span className="text-white bg-[red] rounded-[50%] mr-[10px] w-[25px] h-[25px] flex items-center justify-center">
            A
          </span>
        )}
      </div>
    </div>
  );
}
