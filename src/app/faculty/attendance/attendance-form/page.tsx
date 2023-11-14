'use client';
import React from 'react'
import AttendanceForm from './AttendanceForm';
import BottomNavbar from '../../components/bottomNavbar/BottomNavbar';

const page = () => {
  return (
    <div>
      <BottomNavbar/>
     <AttendanceForm/>
    </div>
  )
}

export default page