"use client";
import { auth } from "@/lib/firebase-config"; // Import deleteUser function from Firebase or your authentication library
import { Button, Checkbox, message } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { BsStack, BsTrash } from "react-icons/bs";

const DeleteAccount = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [user, setUser] = useState<any>(); // Replace with your authentication library's user object

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
      console.log(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      messageApi.open({
        type: "error",
        content: "Please confirm that you want to delete your account.",
        duration: 15,
      });
      return;
    }

    try {
      // Call your delete account function (e.g., deleteUser) here
      // Make sure to handle authentication and account deletion logic
      await user.delete();

      messageApi.open({
        type: "success",
        content: "Your account has been successfully deleted.",
      });

      // Optionally, you can redirect the user or perform additional actions after deletion
    } catch (error) {
      messageApi.open({
        type: "error",
        content:
          "Please login first to delete your account and associated data!",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh]">
        <div className="flex flex-col items-center justify-center w-11/12 max-w-[450px] bg-white rounded-lg border p-4 border-solid border-gray-50">
          <h4 className="font-poppins flex flex-row  my-6 font-semibold  text-[24px] text-gray-800 mt-8">
            <BsStack className="w-10 h-10 text-[#0577fb] pr-2" /> Edustack
          </h4>
          <h4 className="font-poppins flex flex-row my-4 font-semibold text-[24px] text-gray-700 mt-3">
            <BsTrash className="w-10 h-10 text-[#ff4d4f] pr-2" /> Delete Account
          </h4>

          <Checkbox
            className="mb-4"
            checked={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.checked)}
          >
            I confirm that I want to delete my account and all associated data.
          </Checkbox>

          <Button
            onClick={handleDeleteAccount}
            className="w-full h-10 mt-2 mb-2 rounded-lg"
            type="primary"
          >
            Delete Account
          </Button>

          <p className="font-poppins text-[12px] text-gray-700 mt-3 mb-6">
            {/* You can include a link to go back or navigate to another page */}
            <a href="/student/home" className="text-[#0577fb]">
              Back to Dashboard
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default DeleteAccount;
