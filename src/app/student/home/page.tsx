import React, { Suspense } from 'react'
import Navbar from '../components/navbar/Navbar';
import styles from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar';
import StudentHome from './StudentHome';
import Loading from './loading';



function App() {
  


  return (
    <>
  
    <Suspense fallback={<Loading/>}>
    <TopNavbar name='EduStack'/>
    <div className={styles.pageContainer}>    
        <StudentHome/>
    </div>
    <Navbar />
    </Suspense>
    
    </>
  ) 

}

export default App