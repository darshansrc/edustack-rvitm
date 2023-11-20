"use client";
import { auth } from "@/lib/firebase-config";
import { Button, Input, message } from "antd";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { BsStack } from "react-icons/bs";

const ForgotPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [enteredEmail, setEnteredEmail] = useState("");

  const handleFormSubmit = async () => {
    if (enteredEmail === "") {
      alert("Please enter your college email");
      return;
    }

    sendPasswordResetEmail(auth, enteredEmail).then(() => {
      messageApi.open({
        type: "success",
        content:
          "Password reset link sent to your email, please check your inbox!",
        duration: 15,
      });
      setEnteredEmail("");
    });
  };
  return (
    <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh]">
      <div className="flex flex-col items-center justify-center w-11/12 max-w-[450px]  bg-white rounded-lg border p-4 border-solid border-gray-50">
        <h4 className="font-poppins flex flex-row  my-4 font-semibold  text-[22px] text-gray-700 mt-3">
          <BsStack className="w-8 h-8 text-[#0577fb] pr-2" /> Edustack
        </h4>

        <h4 className="font-poppins  my-4  text-[16px] text-gray-700 mt-3">
          Reset your Password
        </h4>

        <p className="font-poppins w-full text-left pl-2 text-[12px] text-gray-700 my-6">
          College Mail
        </p>
        <Input
          placeholder="Enter your college email"
          value={enteredEmail}
          type="email"
          onChange={(e) => setEnteredEmail(e.target.value)}
          size="large"
        />

        <Button
          onClick={handleFormSubmit}
          type="primary"
          className="w-full h-10 mt-6 mb-2 rounded-lg"
        >
          Next
        </Button>

        <p className="font-poppins  text-[12px] text-gray-700 mt-3 mb-6">
          <a href="/auth/login" className="text-[#0577fb]">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPage;
