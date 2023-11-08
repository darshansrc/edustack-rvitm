import {  db } from '@/lib/firebase-config';
import getUser from '@/lib/getUser';
import { collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

import styles from './StudentHomePage.module.css'
import { BsClockHistory, BsPersonCheck } from 'react-icons/bs';
import { RxReader } from 'react-icons/rx'
import { TbReportAnalytics } from 'react-icons/tb';
import { RiThreadsLine } from 'react-icons/ri';
import { BiSpreadsheet } from 'react-icons/bi';
import { Skeleton } from '@mui/material';
import Link from 'next/link';
import { Suspense } from 'react';


const storage = getStorage();

const FetchStudentData = async () => {


  type user = {
    uid: string;
    email?: string;
    picture?: string;
  }

  const user : user | null = await getUser();

  interface StudentDetails  {
    studentName: string;
    studentUSN: string;
    className: string;
   

  };
  

  let FetchedStudentDetails : StudentDetails = {
    studentName: '',
    studentUSN: '',
    className: '',

  };



  

  const dataFetched = true;
  if (user) {

    console.log(user)
      
    const queryPath = 'students';
    const collectionGroupRef = collectionGroup(db, queryPath);
    const studentQuery = query(collectionGroupRef, where('email', '==', user.email));
    const studentSnapshot = await getDocs(studentQuery);

    await Promise.all(
      studentSnapshot.docs.map(async (studentDoc) => {
        const className = studentDoc.ref.parent.parent?.id || '';
        const studentID = studentDoc.ref.id;
        const classDocRef = doc(db, 'database', className);
        const classDocSnapshot = await getDoc(classDocRef);

        if (classDocSnapshot.exists()) {
          const classSemester = classDocSnapshot.data().currentSemester;
          const studentLabBatch = studentDoc.data().labBatch;
          const studentName = studentDoc.data().name;
          const studentUSN = studentDoc.data().usn;
          const studentEmail = studentDoc.data().email;

          console.log(studentUSN)


     

          FetchedStudentDetails   = {
            studentName,
            studentUSN,
            className,

          }



        }
      })
    );



}

const fetchPhotoUrl = async () => {
  const url = await getDownloadURL(ref(storage, `photos/${FetchedStudentDetails.studentUSN}.jpg`));
  return url;
};

let photoUrl = '';

if(FetchedStudentDetails.studentUSN){
  photoUrl = await fetchPhotoUrl();
}



      
  
  return (
    <div className={styles.homePageContainer}>

    <div className={styles.welcomeCard}>
      <div style={{marginRight: '14px'}}>
        { FetchedStudentDetails ? (
           <img   src={photoUrl ? photoUrl :'/None.jpg'} alt={''} style={{width:'60px' , height:'60px', margin: '0 10px', objectFit: 'cover',borderRadius: '50%', boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)',}}/>
        ) : (
          <Skeleton variant="circular" width={60} height={60} />
        )}
       
      </div>

      <div>
      <div className={styles.studentName}>Welcome, {FetchedStudentDetails?.studentName}</div>
      <div className={styles.studentDetail}>USN: {FetchedStudentDetails?.studentUSN}, CLASS: {FetchedStudentDetails?.className}</div>
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

  )
}

export default FetchStudentData;