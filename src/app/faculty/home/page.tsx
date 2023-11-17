"use client";
import getUser from "@/lib/getUser";
import React from "react";
import BottomNavbar from "../components/bottomNavbar/BottomNavbar";
import TopNavbar from "@/app/student/components/topnavbar/TopNavbar";
import FacultyHomePage from "./FacultyHomePage";
import DesktopNavbar from "../components/DesktopNavBar/DesktopNavbar";
import FloatingMarkAttendaceActionButton from "../components/FloatingMarkAttendaceActionButton/FloatingMarkAttendaceActionButton";

async function App() {
  return (
    <>
      <TopNavbar name="Edustack" />
      <FloatingMarkAttendaceActionButton />

      <FacultyHomePage />
    </>
  );
}

export default App;
