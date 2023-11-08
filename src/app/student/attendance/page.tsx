import React, { Suspense } from 'react'
import Navbar from '../components/navbar/Navbar'
import TopNavbar from '../components/topnavbar/TopNavbar'
import { FetchAttendance } from './FetchAttendance'



const page = async () => {


  return (
    <>

       <TopNavbar name={'Attendance Dashboard'}/>
       <FetchAttendance />
       <Navbar/>

    </>
  )
}

export default page