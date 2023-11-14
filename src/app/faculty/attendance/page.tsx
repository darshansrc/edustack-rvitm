
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar'
import Link from 'next/link'
import React from 'react'
import BottomNavbar from '../components/bottomNavbar/BottomNavbar'
import AttendanceDashboard from './attendance-dashboard/AttendanceDashboard'
import DesktopNavbar from '../components/DesktopNavBar/DesktopNavbar'
import { Layout } from 'antd'

const page = () => {
  return (
    <div className='flex flex-row w-[100vw]'>
      <div className='hidden md:block'>
      <DesktopNavbar/>
      </div>
      <div className='block md:hidden'>
        <BottomNavbar/>
      </div>
      <Layout style={{width: '100%'}} >
      <AttendanceDashboard/>
      </Layout>
        
 
    </div>

  )
}

export default page