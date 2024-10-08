import React from 'react'
import Navbar from '../components/navbar/Navbar'
import styles from '../components/navbar/Navbar.module.css'
import StudentAttendanceTable from './StudentAttendanceTable'
import TopNavbar from '../components/topnavbar/TopNavbar'

const page = async () => {



  return (
    <>

    <TopNavbar name={'Attendance Dashboard'}/>
    <div className={styles.pageContainer}>
    
        <StudentAttendanceTable/>
    </div>
    </>
  )
}

export default page