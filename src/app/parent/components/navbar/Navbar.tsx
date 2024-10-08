"use client";
import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { RiGraduationCapLine } from "react-icons/ri";
import { BiHomeAlt } from "react-icons/bi";
import { TbReport } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { BsPersonCheck } from "react-icons/bs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname: string = usePathname() || "";

  return (
    <nav className={styles.navBar}>
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

      <Link href={"/parent/home"}>
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

      <Link href="/parent/attendance">
        <div
          className={
            pathname.endsWith("/attendance")
              ? styles.navItemActive
              : styles.navItem
          }
        >
          <i style={{ fontWeight: "500" }}>
            <BsPersonCheck style={{ fontSize: "25px" }} />
          </i>
          <div
            className={
              pathname.endsWith("/attendance")
                ? styles.navTextActive
                : styles.navText
            }
            style={{ fontFamily: "Poppins" }}
          >
            Attendance
          </div>
        </div>
      </Link>

      <Link href="/parent/grades">
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
              pathname.endsWith("/grades")
                ? styles.navTextActive
                : styles.navText
            }
            style={{ fontFamily: "Poppins" }}
          >
            Grades
          </div>
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
