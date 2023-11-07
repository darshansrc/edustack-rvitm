'use client';
import React, { useEffect, useState } from 'react'
import styles from './CourseMaterial.module.css'
import Skeleton from '@mui/material/Skeleton';


interface SubjectOption {
  value: string;
  label: string;
  subjectType: string;
}

const CourseMaterial = () => {

  const [dataFetched, setDataFetched] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState<SubjectOption[]>([]);

  const customComparator = (a, b) => {
    const lastCharA = a.value.slice(-1);
    const lastCharB =  b.value.slice(-1);
    if (lastCharA < lastCharB) return -1;
    if (lastCharA > lastCharB) return 1;
    return 0;
  };


  useEffect(() => {
    async function fetchAttendanceData() {
      try {
        const currentServerDomain = window.location.origin;
        const responseAPI = await fetch(`${currentServerDomain}/api/student/attendance`, {
          method: 'GET',
        });
        if (responseAPI.status === 200) {
          const responseBody = await responseAPI.json();
          setSubjectOptions(responseBody.subjectOptions.sort(customComparator));
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

  return (
      
    <div className={styles.contentContainer}>

    <div className={styles.container}>
                      <table className={styles.attendanceTable}>
                <thead>
                  <tr >
                    <th className={styles.tableHead} style={{ borderTopLeftRadius: '10px' }}>
                      Subject 
                    </th>
                    <th className={styles.tableHead}>
                      Faculty
                    </th>
                    <th className={styles.tableHead} style={{ borderTopRightRadius: '10px' }}>
                      Google Site
                    </th>
                  </tr>
                </thead>

                <tbody>
                {subjectOptions && dataFetched  ? (
                  subjectOptions
                    .filter((subject) => subject.subjectType === 'theory')
                    .map((theorySubject, filteredIndex) => {
                      // Find the original index in the unfiltered array
                      const originalIndex = subjectOptions.findIndex(subject => subject === theorySubject);
                      
                      return (
                        <tr key={filteredIndex}>
                          <td className={styles.tableSubject}>
                            {theorySubject.label + ' (' + theorySubject.value + ')'}
                          </td>
                          <td className={styles.tableData}>-</td>
                          <td className={styles.tableData}>-</td>
                    
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                    <td className={styles.tableSubject}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    </td>
                    <td className={styles.tableData}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    </td>
                    <td className={styles.tableData}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    </td>
                  </tr>
                  )}
                </tbody>

                </table>
    </div>
    </div>
  )
}

export default CourseMaterial