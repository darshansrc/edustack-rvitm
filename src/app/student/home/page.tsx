import React from 'react'
import Navbar from '../components/navbar/Navbar';
import styles from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar';
import StudentHomePage from './StudentHomePage';
import { StudentProvider } from '@/app/context/StudentContext';
import { AppProps } from 'next/app';

async function App({ Component, pageProps }: AppProps) {


  return (
    <>
   
    
    <div className={styles.pageContainer}>
        <TopNavbar name='EduStack'/>

      
        <StudentProvider>
        <StudentHomePage {...pageProps}/>
        </StudentProvider>
        
        <Navbar />
    </div>
    </>
  ) 

}

export default App