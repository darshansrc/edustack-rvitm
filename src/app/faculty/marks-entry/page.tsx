
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar'
import Link from 'next/link'
import React from 'react'
import BottomNavbar from '../components/bottomNavbar/BottomNavbar'
import DesktopNavbar from '../components/DesktopNavBar/DesktopNavbar'

const page = () => {
  return (
    <>
    <TopNavbar name='Marks Entry'/>
 
        {/* <DesktopNavbar/> */}
    <BottomNavbar/>
    </>

  )
}

export default page