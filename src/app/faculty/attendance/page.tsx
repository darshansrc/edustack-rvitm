
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar'
import Link from 'next/link'
import React from 'react'
import BottomNavbar from '../components/bottomNavbar/BottomNavbar'

const page = () => {
  return (
    <>
    <TopNavbar name='Attendance Dashboard'/>
        <div style={{marginTop: '150px'}}>
        <Link href='faculty/attendance/attendance-form'  shallow={true}>
            Mark Attendance
        </Link>
    </div>
    <BottomNavbar/>
    </>

  )
}

export default page