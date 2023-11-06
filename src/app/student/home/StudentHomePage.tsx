'use client';
import { auth } from '@/lib/firebase-config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
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


const StudentHomePage = () => {


  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [classSemester, setClassSemester] = useState('');
  const [classId, setClassId] = useState<any>(null);
  const [dataFetched, setDataFetched] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchAttendanceData() {
      try {
        const currentServerDomain = window.location.origin;
        const responseAPI = await fetch(`${currentServerDomain}/api/student/attendance`, {
          method: 'GET',
        });
        if (responseAPI.status === 200) {
          const responseBody = await responseAPI.json();
          setStudentDetails(responseBody.studentDetails);        
          setClassId(responseBody.studentDetails.className);
          setClassSemester(responseBody.studentDetails.classSemester);
          setDataFetched(true);

         
        } else {
          console.log('Cannot fetch data');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }

    fetchAttendanceData();
  }, []);

  const handleSignOut = async () => {
    signOut(auth);
    const response = await fetch(`${window.location.origin}/api/signout`, {
        method: "POST",
      });
      if (response.status === 200) {
        router.push("/");
      }
    }
  
  return (
    <div className={styles.homePageContainer}>

      <div className={styles.welcomeCard}>
        <div style={{marginRight: '14px'}}>
         <Image priority width={60} height={60} src='/None.jpg' alt={''} style={{margin: '0 10px',borderRadius: '50%'}}/>
        </div>
        {dataFetched ? (
        <div>
        <div className={styles.studentName}>Welcome, {studentDetails?.studentName}</div>
        <div className={styles.studentDetail}>USN: {studentDetails?.studentUSN}, CLASS: {studentDetails?.className}</div>
      </div>
        ) : (
          <div>
          <div className={styles.studentName}><Skeleton variant="text" sx={{ fontSize: '1.4rem' }} /></div>
          <div className={styles.studentDetail}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></div>
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
        <div className={styles.menuItem} onClick={() => router.push('/student/attendance')}>
          <div className={styles.menuItemIcon}>
            <BsPersonCheck size={25} style={{margin: '0 10px', color: '#333'}}/>
          </div>
          <div className={styles.menuItemText}>Attendance</div>
        </div>

        <div className={styles.menuItem} onClick={() => router.push('/student/assignments')}>
          <div className={styles.menuItemIcon}>
          <BsClockHistory size={25} style={{margin: '0 10px' , color: '#333'}}/>
          </div>
          <div className={styles.menuItemText}>Schedule</div>
        </div>

        <div className={styles.menuItem} onClick={() => router.push('/student/notes')}>
          <div className={styles.menuItemIcon}>
          <BiSpreadsheet size={25} style={{margin: '0 10px' , color: '#333'}}/>
          </div>
          <div className={styles.menuItemText}>Assignment</div>
        </div>

        <div className={styles.menuItem} onClick={() => router.push('/student/fees')}>
          <div className={styles.menuItemIcon}>
          <RxReader size={25} style={{margin: '0 10px' , color: '#333'}}/>
          </div>
          <div className={styles.menuItemText}>IA Marks</div>
        </div>

        <div className={styles.menuItem} onClick={() => router.push('/student/fees')}>
          <div className={styles.menuItemIcon}>
          <TbReportAnalytics size={25} style={{margin: '0 10px' , color: '#333'}}/>
          </div>
          <div className={styles.menuItemText}>CGPA</div>
        </div>

        <div className={styles.menuItem} onClick={() => router.push('/student/profile')}>
          <div className={styles.menuItemIcon}>
          <RiThreadsLine size={25} style={{margin: '0 10px' , color: '#333'}}/>
          </div>
          <div className={styles.menuItemText}>Material</div>
        </div>

      </div>

    </div>
  )
}

export default StudentHomePage;