import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./RightSideOfPage.module.css";

const RightSideOfPage = () => {
  return (
    <>
      <div
        className=" h-full w-1/2 rounded-r-xl  max-sm:w-full p-3 max-md:rounded-xl"
        style={{ backgroundColor: "white" }}
      >
        <div className={styles.pageContainer}>
          <div className="flex items-center justify-center">
            <Image
              priority
              width={60}
              height={60}
              src="/logo.png"
              style={{
                maxWidth: "60px",
                maxHeight: "60px",
                alignItems: "center",
              }}
              alt={""}
            />
            <h1 style={{ fontSize: "25px", padding: "10px" }} className="m-3">
              |
            </h1>
            <Image
              priority
              width={60}
              height={60}
              src="/logorv.png"
              style={{
                maxWidth: "60px",
                maxHeight: "60px",
                alignItems: "center",
              }}
              alt={""}
            />
          </div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "bolder",
              margin: "20px",
              fontFamily: "golos text",
              fontVariant: "600",
            }}
          >
            Welcome to EduStack for RVITM
          </h1>
          <p className="text-gray-500 font-sans font-medium text-base max-sm:mb-8">
            A Platform Built to Simplify Attendance Tracking & Academics{" "}
          </p>
          <div className={styles.buttonContainer}>
            <Link href="/auth/signin" shallow={true} style={{ width: "95%" }}>
              <button className={styles.primaryButton}>Sign In </button>
            </Link>
            <button className={styles.secondaryButton} style={{ width: "95%" }}>
              Activate your Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSideOfPage;
