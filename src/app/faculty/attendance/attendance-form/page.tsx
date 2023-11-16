'use client';
import React from 'react'
import AttendanceForm from './AttendanceForm';
import BottomNavbar from '../../components/bottomNavbar/BottomNavbar';
import DesktopNavbar from '../../components/DesktopNavBar/DesktopNavbar';

const page = () => {
  return (
    <div>
      <BottomNavbar/>
     <AttendanceForm/>
     <DesktopNavbar/>
    </div>
  )
}

export default page