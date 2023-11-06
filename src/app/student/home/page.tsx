import React from 'react'
import Navbar from '../components/navbar/Navbar';
import styles from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar';
import StudentHomePage from './StudentHomePage';

async function App() {


  return (
    <>
   
    
    <div className={styles.pageContainer}>
        <TopNavbar name='EduStack'/>

      
 
        <StudentHomePage />
    
        
        <Navbar />
    </div>
    </>
  ) 

}

export default App