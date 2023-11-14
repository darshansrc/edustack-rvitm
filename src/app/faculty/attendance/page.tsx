
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar'
import Link from 'next/link'
import React from 'react'
import BottomNavbar from '../components/bottomNavbar/BottomNavbar'
import AttendanceDashboard from './attendance-dashboard/AttendanceDashboard'

const page = () => {
  return (
    <>
    <TopNavbar name='Attendance Dashboard'/>
        <AttendanceDashboard/>
    <BottomNavbar/>
    </>

  )
}

export default page