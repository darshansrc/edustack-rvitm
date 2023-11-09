'use client';
import {  auth, db } from '@/lib/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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



const StudentHomePage =  () => {

  interface studentDetails {
    studentName: string;
    studentUSN: string;
    className: string;
    classSemester: string;
    studentLabBatch: string;
    studentPhoto: string;
    userUID: string;
  }
  
  const [ studentDetails, setStudentDetails ] = useState<studentDetails>({
    studentName: '',
    studentUSN: '',
    className: '',
    classSemester: '',
    studentLabBatch: '',
    studentPhoto: '',
    userUID: '',
  });

  const [ photoUrl, setPhotoUrl ] = useState<string>('');
  const [ dataFetched, setDataFetched ] = useState<boolean>(false);
  const [ user, setUser ] = useState<any>(null);


  const storage = getStorage();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
      console.log(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  const fetchAttendanceData = async () => {
    try {
      const currentServerDomain = window.location.origin;
      const responseAPI = await fetch(`${currentServerDomain}/api/student/home`, {
        method: 'GET',
      });

      if (responseAPI.status === 200) {
        const responseBody = await responseAPI.json();
        setStudentDetails(responseBody.studentDetails);

        getDownloadURL(ref(storage, `photos/${responseBody.studentDetails.studentUSN}.jpg`))
          .then((url) => {
            setPhotoUrl(url);
            sessionStorage.setItem('photoUrl', url);
          })
          .catch((error) => {
            console.log(error);
          });

        setDataFetched(true);

        // Store studentDetails in localStorage
        sessionStorage.setItem('studentDetails', JSON.stringify(responseBody.studentDetails));
      } else {
        console.log('Cannot fetch data');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }



  useEffect(() => {
        
    const storedStudentDetails = sessionStorage.getItem('studentDetails');
    const storedPhotoUrl = sessionStorage.getItem('photoUrl');

    if (storedStudentDetails) {
     
      const parsedStudentDetails = JSON.parse(storedStudentDetails);
      const userUidMatch = parsedStudentDetails.userUID === user?.uid;

      if(userUidMatch){
        setStudentDetails(parsedStudentDetails);
        setDataFetched(true);
        if(storedPhotoUrl){
          setPhotoUrl(storedPhotoUrl); 
        }
      }
      
    } 

    fetchAttendanceData();
    
  }, [user]);



  
  return (
    <div className={styles.homePageContainer}>


      

      <div className={styles.welcomeCard}>
        <div style={{marginRight: '14px'}}>
          { dataFetched ? (
             <Image   src={photoUrl} alt={''} height={60} width={60} style={{width:'60px' , height:'60px', margin: '0 10px', objectFit: 'cover',borderRadius: '50%', boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)',}}/>
          ) : (
            <Skeleton variant="circular" width={60} height={60} />
          )}
         
        </div>
        {dataFetched ? (
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
         <Image priority width={60} height={60} src='/logorv.png' alt={''} style={{margin: '0 10px',borderRadius: '50%'}}/>
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
            <BsPersonCheck size={25} style={{margin: '0 10px', color: '#475569'}}/>
          </div>
          <div className={styles.menuItemText}>Attendance</div>
        </div>
        </Link>

        <Link href='/student/course'  shallow={true}>
        <div className={styles.menuItem}>
          <div className={styles.menuItemIcon}>
          <BsClockHistory size={25} style={{margin: '0 10px' , color: '#475569'}}/>
          </div>
          <div className={styles.menuItemText} >Schedule</div>
        </div>
        </Link>
      
        <Link href={{pathname: '/student/course', query: {tab: 2}}}  shallow={true}>
        <div className={styles.menuItem} >
          <div className={styles.menuItemIcon}>
          <BiSpreadsheet size={25} style={{margin: '0 10px' , color: '#475569'}}/>
          </div>
          <div className={styles.menuItemText}>Assignment</div>
        </div>
        </Link>

        <Link href='/student/grades'  shallow={true}>
        <div className={styles.menuItem} >
          <div className={styles.menuItemIcon}>
          <RxReader size={25} style={{margin: '0 10px' , color: '#475569'}}/>
          </div>
          <div className={styles.menuItemText}>IA Marks</div>
        </div>
        </Link>


        <Link href={{pathname: '/student/grades', query: {tab: 1}}}  shallow={true}>
        <div className={styles.menuItem} >
          <div className={styles.menuItemIcon}>
          <TbReportAnalytics size={25} style={{margin: '0 10px' , color: '#475569'}}/>
          </div>
          <div className={styles.menuItemText}>CGPA</div>
        </div>
        </Link>

        <Link href={{pathname: '/student/course', query: {tab: 1}}}  shallow={true}>
        <div className={styles.menuItem} >
          <div className={styles.menuItemIcon}>
          <RiThreadsLine size={25} style={{margin: '0 10px' , color: '#475569'}}/>
          </div>
          <div className={styles.menuItemText}>Material</div>
        </div>
        </Link>

      </div>

<p>innerWidth: " {window.innerWidth }</p>
<p>innerHeight: " {window.innerHeight}</p>
<p>outerWidth: " {window.outerWidth }</p>
<p>outerHeight: " {window.outerHeight}</p>;

    </div>
  )
}

export default StudentHomePage;