'use client';
import {  auth, db } from '@/lib/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import styles from './FacultyHomePage.module.css'
import Image from 'next/image';
import { BsClockHistory, BsPersonCheck } from 'react-icons/bs';
import { RxReader } from 'react-icons/rx'
import { TbReportAnalytics } from 'react-icons/tb';
import { RiThreadsLine } from 'react-icons/ri';
import { BiSpreadsheet } from 'react-icons/bi';
import { Skeleton } from '@mui/material';
import Link from 'next/link';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

interface facultyDetails {
  facultyType: string;
  facultyName: string;
  facultyDepartment: string;
}

const FacultyHomePage =  () => {


  
  const [facultyDetails, setFacultyDetails] = useState<facultyDetails>({
    facultyType: '',
    facultyName: '',
    facultyDepartment: '',
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


  const fetchFacultyData = async () => {
    try {
      const currentServerDomain = window.location.origin;
      const responseAPI = await fetch(`${currentServerDomain}/api/faculty/home`, {
        method: 'GET',
      });

      if (responseAPI.status === 200) {
        const responseBody = await responseAPI.json();
        setFacultyDetails(responseBody.facultyDetails);

        getDownloadURL(ref(storage, `photos/${user.email}.jpg`))
          .then((url) => {
            setPhotoUrl(url);
            localStorage.setItem('photoUrl', url);
          })
          .catch((error) => {
            console.log(error);
          });

        setDataFetched(true);

        // Store studentDetails in localStorage
        localStorage.setItem('facultyDetails', JSON.stringify(responseBody.facultyDetails));
      } else {
        console.log('Cannot fetch data');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }



  useEffect(() => {
        
    const storedFacultyDetails = localStorage.getItem('facultyDetails');
    const storedPhotoUrl = localStorage.getItem('photoUrl');

    if (storedFacultyDetails) {
     
      const parsedFacultyDetails = JSON.parse(storedFacultyDetails);
      const userUidMatch = parsedFacultyDetails.userUID === user?.uid;

      if(userUidMatch){
        setFacultyDetails(parsedFacultyDetails);
        setDataFetched(true);
        // if(storedPhotoUrl){
        //   setPhotoUrl(storedPhotoUrl); 
        // }
      }
      
    } 

    fetchFacultyData();
    
  }, [user]);



  
  return (
    <div className={styles.homePageContainer}>


      

      <div className={styles.welcomeCard}>
        <div style={{marginRight: '14px'}}>
          { dataFetched ? (
             <Image   src={photoUrl ? photoUrl : '/None.jpg'} alt={''} height={60} width={60} style={{width:'60px' , height:'60px', margin: '0 10px', objectFit: 'cover',borderRadius: '50%', boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)',}}/>
          ) : (
            <Skeleton variant="circular" width={60} height={60} />
          )}
         
        </div>
        {dataFetched ? (
        <div>
        <div className={styles.studentName}>Welcome, {facultyDetails?.facultyName}</div>
        <div className={styles.studentDetail}> {facultyDetails?.facultyType}, Dept. of {facultyDetails?.facultyDepartment}</div>
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



    </div>
  )
}

export default FacultyHomePage;