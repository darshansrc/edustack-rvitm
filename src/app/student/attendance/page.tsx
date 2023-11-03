import React from 'react'
import Navbar from '../components/navbar/Navbar'
import styles from '../components/navbar/Navbar.module.css'
import StudentAttendanceTable from './StudentAttendanceTable'

const page = async () => {



  return (
    <>
    <Navbar/>
    <div >
        <StudentAttendanceTable/>
    </div>
    </>
  )
}

export default page