import React from 'react'
import Navbar from '../components/navbar/Navbar'
import styles from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar'
import { FetchAttendance } from './FetchAttendance'

const page = async () => {



  return (
    <>
    <Navbar/>
    <TopNavbar name={'Attendance Dashboard'}/>
    <div className={styles.pageContainer}>
    
        <FetchAttendance />
    </div>
    </>
  )
}

export default page