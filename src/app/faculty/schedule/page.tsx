'use client'
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar'
import React from 'react'
import ScheduleDashboard from './ScheduleDashboard'
import BottomNavbar from '../components/bottomNavbar/BottomNavbar'

const page = () => {
  return (
    <>
        <TopNavbar name='Your Schedule'/>
        <ScheduleDashboard/>
        <BottomNavbar/>
    </>
  )
}

export default page