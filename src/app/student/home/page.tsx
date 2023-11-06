

import React from 'react'
import Navbar from '../components/navbar/Navbar';
import styles from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar';
import StudentHomePage from './StudentHomePage';

async function App() {


  return (
    <>
    <StudentHomePage />
   <Navbar />
    <div className={styles.pageContainer}>
        <TopNavbar name='EduStack'/>

      
 
       
    
        
       
    </div>
    </>
  ) 

}

export default App