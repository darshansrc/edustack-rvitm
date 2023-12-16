import TopNavbar from "@/app/student/components/topnavbar/TopNavbar";
import Link from "next/link";
import React from "react";
import BottomNavbar from "../components/bottomNavbar/BottomNavbar";
import AttendanceDashboard from "./attendance-dashboard/AttendanceDashboard";
import DesktopNavbar from "../components/DesktopNavBar/DesktopNavbar";

const page = () => {
  return (
    <>
      <TopNavbar name="Attendance Dashboard" />
      <AttendanceDashboard />
    </>
  );
};

export default page;
