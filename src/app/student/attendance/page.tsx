import React, { Suspense } from 'react'
import Navbar from '../components/navbar/Navbar'
import styles from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar'
import { FetchAttendance } from './FetchAttendance'
import Loading from './loading'

const page = async () => {



  return (
    <>

    <Suspense fallback={<Loading/>}>
       
       <TopNavbar name={'Attendance Dashboard'}/>
       <FetchAttendance />
       <Navbar/>

    </Suspense>
        

    </>
  )
}

export default page