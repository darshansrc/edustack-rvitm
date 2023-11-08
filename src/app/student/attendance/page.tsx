import React, { Suspense } from 'react'
import Navbar from '../components/navbar/Navbar'
import styles from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar'
import { FetchAttendance } from './FetchAttendance'
import Loading from './loading'

const page = async () => {



  return (
    <>
    <Navbar/>
    <TopNavbar name={'Attendance Dashboard'}/>
    
    <div className={styles.pageContainer}>
    <Suspense fallback={<Loading/>}>
       <FetchAttendance />
    </Suspense>
        
    </div>
    </>
  )
}

export default page