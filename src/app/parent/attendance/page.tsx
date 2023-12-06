import React from "react";
import Navbar from "@/app/student/components/navbar/Navbar";
import styles from "@/app/student/components/navbar/Navbar.module.css";
import StudentAttendanceTable from "./StudentAttendanceTable";
import TopNavbar from "@/app/student/components/topnavbar/TopNavbar";

const page = async () => {
  return (
    <>
      <TopNavbar name={"Attendance Dashboard"} />
      <div className={styles.pageContainer}>
        <StudentAttendanceTable />
      </div>
    </>
  );
};

export default page;
