import React from 'react'
import Navbar from '../components/navbar/Navbar'
import styles from '../components/navbar/Navbar.module.css'

const page = () => {
  return (
    <>
    <Navbar/>
    <div className={styles.pageContainer}>
        Grades
    </div>
    </>
  )
}

export default page