import React from 'react'
import Navbar from '../components/navbar/Navbar';
import styles from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar';
import FetchStudentData from './FetchStudentData';


function App() {
  


  return (
    <>
    
    <TopNavbar name='EduStack'/>
    <div className={styles.pageContainer}>    
        <FetchStudentData />
    </div>
    <Navbar />
    </>
  ) 

}

export default App