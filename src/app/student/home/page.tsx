import React from 'react'
import Navbar from '../components/navbar/Navbar';
import styles from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar';
import StudentHome from './StudentHome';



function App() {
  


  return (
    <>
  
    <TopNavbar name='EduStack'/>
    <div className={styles.pageContainer}>    
        <StudentHome/>
    </div>
    <Navbar />


    </>
  ) 

}

export default App