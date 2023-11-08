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



const StudentWelcomeCard = async () => {

  const storage = getStorage();

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

          // getDownloadURL(ref(storage, `photos/${studentUSN}.jpg`))
          // .then((url) => {
          //     const photoUrl = url
          // })
          // .catch((error) => {
          //   console.log(error)
          // });

          FetchedStudentDetails   = {
            studentName,
            studentUSN,
            className,

          }



        }
      })
    );

}

      
  
  return (


    <div className={styles.welcomeCard}>

        <div style={{marginRight: '14px'}}>
            <img   src={'/None.jpg'} alt={''} style={{width:'60px' , height:'60px', margin: '0 10px', objectFit: 'cover',borderRadius: '50%', boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)',}}/>
        </div>
     
        <div>
           <div className={styles.studentName}>Welcome, {FetchedStudentDetails?.studentName}</div>
           <div className={styles.studentDetail}>USN: {FetchedStudentDetails?.studentUSN}, CLASS: {FetchedStudentDetails?.className}</div>
        </div>
   
    </div>




  )
}

export default StudentWelcomeCard;