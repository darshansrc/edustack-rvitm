import React from "react";
import Link from "next/link";
import styles from "./RightSideOfPage.module.css";

const RightSideOfPage = () => {
  return (
    <>
      <div className="h-full w-1/2 flex justify-center items-center max-sm:w-full p-3">
        <div className={styles.pageContainer}>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "bolder",
              margin: "15px",
              fontFamily: "poppins",
              fontVariant: "600",
            }}
          >
            Welcome to EduStack for RVITM
          </h1>
          <p
            className="text-gray-500 font-medium text-base"
            style={{
              fontFamily: "poppins",
            }}
          >
            A Platform Built to Simplify Attendance Tracking & Academics{" "}
          </p>
          <div className={styles.buttonContainer}>
            <Link
              href="/auth/signin"
              shallow={true}
              style={{ width: "95%", fontFamily: "poppins" }}
            >
              <button className={styles.primaryButton}>Sign In </button>
            </Link>
            <button
              className={styles.secondaryButton}
              style={{ width: "95%", fontFamily: "poppins" }}
            >
              Activate your Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSideOfPage;
