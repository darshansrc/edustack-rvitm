"use client";
import React, { useEffect, useState } from "react";
import styles from "./BottomNavBar.module.css";
import { RxCalendar } from "react-icons/rx";
import { BiHomeAlt } from "react-icons/bi";
import { TbReport } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { BsPeople } from "react-icons/bs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const BottomNavbar = () => {
  const pathname: string = usePathname() || "";

  const [bottomPadding, setBottomPadding] = useState(0);

  useEffect(() => {
    // Calculate safe area insets and set the bottom padding
    const updateBottomPadding = () => {
      let safeAreaBottom = 0;
      if (window.visualViewport?.height) {
        safeAreaBottom =
          window.visualViewport?.height - window.innerHeight ?? 0;
      }

      setBottomPadding(safeAreaBottom);
    };

    // Initial calculation
    updateBottomPadding();

    // Listen for resize events
    window.addEventListener("resize", updateBottomPadding);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateBottomPadding);
    };
  }, []);

  const navbarStyle = {
    paddingBottom: `${bottomPadding}px`,
  };

  return (
    <nav className={styles.navBar} style={navbarStyle}>
      <div className={styles.navLogo}>
        <Image src="/logo.png" alt="logo" height={30} width={30} />
        <h2
          style={{
            fontWeight: "500",
            fontFamily: "Poppins",
            fontSize: "12px",
            color: "#555",
          }}
        >
          EduStack
        </h2>
      </div>

      <Link href={"/faculty/home"}>
        <div
          className={
            pathname.endsWith("/home") ? styles.navItemActive : styles.navItem
          }
        >
          <i>
            {" "}
            <BiHomeAlt style={{ fontSize: "25px" }} />
          </i>
          <div
            className={
              pathname.endsWith("/home") ? styles.navTextActive : styles.navText
            }
            style={{ fontFamily: "Poppins" }}
          >
            Home
          </div>
        </div>
      </Link>

      <Link href="/faculty/attendance">
        <div
          className={
            pathname.endsWith("/attendance") ||
            pathname.endsWith("/attendance-form") ||
            pathname.endsWith("/export-attendance")
              ? styles.navItemActive
              : styles.navItem
          }
        >
          <i style={{ fontWeight: "500" }}>
            <BsPeople style={{ fontSize: "25px" }} />
          </i>
          <div
            className={
              pathname.endsWith("/attendance") ||
              pathname.endsWith("/attendance-form") ||
              pathname.endsWith("/export-attendance")
                ? styles.navTextActive
                : styles.navText
            }
            style={{ fontFamily: "Poppins" }}
          >
            Attendance
          </div>
        </div>
      </Link>

      <Link href="/faculty/schedule">
        <div
          className={
            pathname.endsWith("/schedule")
              ? styles.navItemActive
              : styles.navItem
          }
        >
          <i>
            <RxCalendar style={{ fontSize: "25px" }} />
          </i>
          <div
            className={
              pathname.endsWith("/schedule")
                ? styles.navTextActive
                : styles.navText
            }
            style={{ fontFamily: "Poppins" }}
          >
            Schedule
          </div>
        </div>
      </Link>

      <Link href="/faculty/marks-entry">
        <div
          className={
            pathname.endsWith("/grades") ? styles.navItemActive : styles.navItem
          }
        >
          <i>
            <TbReport style={{ fontSize: "25px" }} />
          </i>
          <div
            className={
              pathname.endsWith("/marks-entry")
                ? styles.navTextActive
                : styles.navText
            }
            style={{ fontFamily: "Poppins" }}
          >
            Marks Entry
          </div>
        </div>
      </Link>

      <Link href={"/faculty/profile"}>
        <div
          className={
            pathname.endsWith("/profile")
              ? styles.navItemActive
              : styles.navItem
          }
        >
          <i>
            <CgProfile style={{ fontSize: "25px" }} />
          </i>
          <div
            className={
              pathname.endsWith("/profile")
                ? styles.navTextActive
                : styles.navText
            }
            style={{ fontFamily: "Poppins" }}
          >
            Profile
          </div>
        </div>
      </Link>
    </nav>
  );
};

export default BottomNavbar;
