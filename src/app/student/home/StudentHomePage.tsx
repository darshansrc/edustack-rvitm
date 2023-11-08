'use client';
import {  db } from '@/lib/firebase-config';
import { signOut } from 'firebase/auth';
import styles from './StudentHomePage.module.css'
import Image from 'next/image';
import { BsClockHistory, BsFiletypePdf, BsPersonCheck } from 'react-icons/bs';
import { RxReader } from 'react-icons/rx'
import { MdOutlineAssignment } from 'react-icons/md';
import { TbReportAnalytics } from 'react-icons/tb';
import { RiThreadsLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { BiSpreadsheet } from 'react-icons/bi';
import { Skeleton } from '@mui/material';

import getUser from '@/lib/getUser';
import { collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

type StudentDetails = {
  studentName: string;
  studentUSN: string;
  className: string;
};

const StudentHomePage: React.FC<{ studentDetails: StudentDetails }> = ({ studentDetails }) => {





  
  return (
    <div className={styles.homePageContainer}>

      <div className={styles.welcomeCard}>
        <div style={{marginRight: '14px'}}>
          { studentDetails ? (
             <img   src={'/None.jpg'} alt={''} style={{width:'60px' , height:'60px', margin: '0 10px', objectFit: 'cover',borderRadius: '50%', boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)',}}/>
          ) : (
            <Skeleton variant="circular" width={60} height={60} />
          )}
         
        </div>
        {studentDetails ? (
        <div>
        <div className={styles.studentName}>Welcome, {studentDetails?.studentName}</div>
        <div className={styles.studentDetail}>USN: {studentDetails?.studentUSN}, CLASS: {studentDetails?.className}</div>
      </div>
        ) : (
          <div>
          <div className={styles.studentName}><Skeleton variant="text" sx={{ fontSize: '1.4rem',width: 100 }} /></div>
          <div className={styles.studentDetail}><Skeleton variant="text" sx={{ fontSize: '1rem',width: 80 }} /></div>
        </div>          
        )}

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
  )
}

export default StudentHomePage;