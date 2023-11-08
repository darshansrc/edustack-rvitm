import React from 'react'
import styles from './StudentHomePage.module.css'
import { Skeleton } from '@mui/material'
import { BsClockHistory, BsPersonCheck } from 'react-icons/bs';
import { RxReader } from 'react-icons/rx'
import { TbReportAnalytics } from 'react-icons/tb';
import { RiThreadsLine } from 'react-icons/ri';
import { BiSpreadsheet } from 'react-icons/bi';
import Link from 'next/link';
import TopNavbar from '../components/topnavbar/TopNavbar';
import Navbar from '../components/navbar/Navbar';




const Loading = () => {
  return (
    <><TopNavbar name='EduStack'/>
    <Navbar />

    <div className={styles.homePageContainer}>




    <div className={styles.welcomeCard}>
      <div style={{marginRight: '14px'}}>
          <Skeleton variant="circular" width={60} height={60} /> 
      </div>

      <div>
        <div className={styles.studentName}><Skeleton variant="text" sx={{ fontSize: '1.4rem',width: 100 }} /></div>
        <div className={styles.studentDetail}><Skeleton variant="text" sx={{ fontSize: '1rem',width: 80 }} /></div>
      </div>

    </div> 

    

    <div className={styles.welcomeCard}>
      <div style={{marginRight: '15px'}}>
       <img src='/logorv.png' alt={''} style={{width:'60px' , height:'60px', margin: '0 10px',borderRadius: '50%'}}/>
      </div>
      <div>
        <div className={styles.studentName}>RV Institute of Technology & Management</div>
        <div className={styles.studentDetail}>Bangalore, Karnataka</div>
      </div>
    </div>

    <div className={styles.menuBox}>
    
    <Link href='/student/attendance'  shallow={true}>
      <div className={styles.menuItem} >
        <div className={styles.menuItemIcon}>
          <BsPersonCheck size={25} style={{margin: '0 10px', color: '#333'}}/>
        </div>
        <div className={styles.menuItemText}>Attendance</div>
      </div>
      </Link>

      <Link href='/student/course'  shallow={true}>
      <div className={styles.menuItem}>
        <div className={styles.menuItemIcon}>
        <BsClockHistory size={25} style={{margin: '0 10px' , color: '#333'}}/>
        </div>
        <div className={styles.menuItemText}>Schedule</div>
      </div>
      </Link>
    
      <Link href={{pathname: '/student/course', query: {tab: 2}}}  shallow={true}>
      <div className={styles.menuItem} >
        <div className={styles.menuItemIcon}>
        <BiSpreadsheet size={25} style={{margin: '0 10px' , color: '#333'}}/>
        </div>
        <div className={styles.menuItemText}>Assignment</div>
      </div>
      </Link>

      <Link href='/student/grades'  shallow={true}>
      <div className={styles.menuItem} >
        <div className={styles.menuItemIcon}>
        <RxReader size={25} style={{margin: '0 10px' , color: '#333'}}/>
        </div>
        <div className={styles.menuItemText}>IA Marks</div>
      </div>
      </Link>


      <Link href={{pathname: '/student/grades', query: {tab: 1}}}  shallow={true}>
      <div className={styles.menuItem} >
        <div className={styles.menuItemIcon}>
        <TbReportAnalytics size={25} style={{margin: '0 10px' , color: '#333'}}/>
        </div>
        <div className={styles.menuItemText}>CGPA</div>
      </div>
      </Link>

      <Link href={{pathname: '/student/course', query: {tab: 1}}}  shallow={true}>
      <div className={styles.menuItem} >
        <div className={styles.menuItemIcon}>
        <RiThreadsLine size={25} style={{margin: '0 10px' , color: '#333'}}/>
        </div>
        <div className={styles.menuItemText}>Material</div>
      </div>
      </Link>

    </div>

  </div>
  </>
  )
}

export default Loading