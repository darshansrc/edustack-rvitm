import React, { Suspense } from 'react'
import Navbar from '../components/navbar/Navbar';
import styles from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar';
import StudentHomePage from './StudentHomePage';




function Page() {
  


  return (
    <>
  
  
    <TopNavbar name='EduStack'/>
    <div className={styles.pageContainer}>    
        <StudentHomePage/>
    </div>
    <Navbar />


    </>
  ) 

}

export default Page