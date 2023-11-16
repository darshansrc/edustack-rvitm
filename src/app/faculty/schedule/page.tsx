'use client'
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar'
import React from 'react'
import ScheduleDashboard from './ScheduleDashboard'
import BottomNavbar from '../components/bottomNavbar/BottomNavbar'
import DesktopNavbar from '../components/DesktopNavBar/DesktopNavbar'

const page = () => {
  return (
    <>
        <TopNavbar name='Your Schedule'/>
        <ScheduleDashboard/>

    </>
  )
}

export default page