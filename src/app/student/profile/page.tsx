import React from 'react'
import Navbar from '../components/navbar/Navbar'
import styles from '../components/navbar/Navbar.module.css'
import StudentProfile from './StudentProfile'
import TopNavbar from '../components/topnavbar/TopNavbar'

const page = () => {
  return (
    <>
    <TopNavbar name='Profile'/>

    <div className={styles.pageContainer}>
        <StudentProfile />
    </div>
    </>
  )
}

export default page