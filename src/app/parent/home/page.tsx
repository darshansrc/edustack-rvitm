"use client";
import React, { Suspense, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import styles from "../components/navbar/Navbar.module.css";
import TopNavbar from "@/app/student/components/topnavbar/TopNavbar";
import StudentHomePage from "./StudentHomePage";
import Image from "next/image";
import { FaReact } from "react-icons/fa6";
import { IoLogoFirebase } from "react-icons/io5";
import { Modal } from "antd";
import { ModalDialog } from "@mui/joy";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import { useRouter } from "next/navigation";

function Page() {
  const [aboutModalopen, setAboutModalOpen] = useState(false);
  const [logoutModalopen, setLogoutModalOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    signOut(auth);
    const response = await fetch(`${window.location.origin}/api/signout`, {
      method: "POST",
    });
    if (response.status === 200) {
      router.push("/");
    }
  };

  return (
    <>
      <TopNavbar name="Edustack" />
      <div className={styles.pageContainer}>
        <StudentHomePage />

        {/* <div
          className={styles.openNavbarButton}
          onClick={() => setAboutModalOpen(true)}
          style={{ color: "rgb(244, 41, 41)" }}
        >
          About
        </div>

        <div
          className={styles.openNavbarButton}
          onClick={() => setLogoutModalOpen(true)}
          style={{ color: "rgb(244, 41, 41)" }}
        >
          Log Out
        </div> */}

        <Modal
          open={aboutModalopen}
          onOk={() => setAboutModalOpen(false)}
          onCancel={() => setAboutModalOpen(false)}
          title=""
          footer={[]}
        >
          <div className="flex flex-col items-center justify-center">
            <p className="font-poppins font-semibold text-[20px] mb-7">
              About Edustack
            </p>

            <div className="flex w-11/12 items-left flex-row my-2">
              <Image
                src={"/darshan.jpg"}
                width={60}
                height={60}
                className="rounded-[50%] max-w-[60px] mx-2  max-h-[60px]"
                alt=""
              />
              <div className="flex flex-col justify-center">
                <p className="font-poppins font-semibold text-[14px] ">
                  Darshan Gowda
                </p>
                <p className="font-poppins  text-[12px] ">
                  Developer, 5th sem ISE
                </p>
              </div>
            </div>

            <div className="flex w-11/12 items-left flex-row my-4">
              <Image
                src={"/dhyaan.jpeg"}
                width={60}
                height={60}
                className="rounded-[50%] mx-2 max-w-[60px] max-h-[60px] "
                alt=""
              />
              <div className="flex flex-col justify-center">
                <p className="font-poppins font-semibold text-[14px] ">
                  Dhyaan Kotian
                </p>
                <p className="font-poppins  text-[12px]">
                  UI/UX Contributor, 5th sem CSE
                </p>
              </div>
            </div>

            <div className="flex w-11/12 items-left flex-row my-2">
              <Image
                src={"/abhijat.jpg"}
                width={60}
                height={60}
                className="rounded-[50%] mx-2 max-w-[60px] max-h-[60px]"
                alt=""
              />
              <div className="flex flex-col justify-center">
                <p className="font-poppins font-semibold text-[14px] ">
                  Abhijat Dakshesh
                </p>
                <p className="font-poppins  text-[12px] ">
                  Deployment Management, 5th sem ISE
                </p>
              </div>
            </div>

            <p className="font-poppins flex flex-row items-center justify-center  text-[14px] mt-8">
              Platform Built with <FaReact className="mx-1" /> ReactJS and{" "}
              <IoLogoFirebase className="mx-1" /> Firebase
            </p>
          </div>
        </Modal>

        <Modal open={logoutModalopen} footer={[]}>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Poppins",
              fontWeight: "500",
              color: "#333",
              fontSize: "18px",
              paddingBottom: "0px",
            }}
          >
            Confirm Logout?
          </h2>

          <h2
            style={{
              textAlign: "center",
              fontFamily: "Poppins",
              fontWeight: "400",
              color: "#333",
              fontSize: "12px",
              paddingBottom: "20px",
            }}
          >
            You will be returned to the login screen.
          </h2>

          <div
            className={styles.openNavbarButton}
            onClick={() => handleSignOut()}
            style={{
              color: "rgb(244, 41, 41)",
              margin: "0",
              padding: "10px",
            }}
          >
            Log Out
          </div>
          <div
            className={styles.openNavbarButton}
            onClick={() => setLogoutModalOpen(false)}
            style={{ color: "#0577fb", margin: "0", padding: "10px" }}
          >
            Cancel
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Page;
