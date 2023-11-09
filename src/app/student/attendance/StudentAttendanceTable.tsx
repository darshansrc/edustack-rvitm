'use client';
import React, { useEffect, useRef, useState } from 'react';
import DonutChart from './DonutChart';
import { Chart } from 'chart.js/auto';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AiOutlineRightCircle } from 'react-icons/ai';
import AppBar from '@mui/material/AppBar';
import { Tab as MyTab, Tabs as MyTabs, TabList as MyTabList, TabPanel as MyTabPanel } from 'react-tabs';
import 'react-datepicker/dist/react-datepicker.css';
import './StudentAttendanceTable.css';
import { Box, Card, CardContent, Typography } from '@mui/material';
import styles from './StudentAttendanceTable.module.css'
import Skeleton from '@mui/material/Skeleton';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs'
import { styled } from '@mui/material/styles';
import { BiTime } from 'react-icons/bi';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';

interface SubjectOption {
  value: string;
  label: string;
  subjectType: string;
}

interface AttendanceData {
  slice: any;
  attendance: { usn: string; Present: boolean }[];
  date: string;
  sessionTime: string;
  presentCount: number;
  absentCount: number;
}

interface StyledTabProps {
  label: string;
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}


interface studentDetails {
  studentName: string;
  studentEmail: string;
  studentID: string;
  studentUSN: string;
  studentLabBatch: string;
  classSemester: string;
  className: string;
  uid: string;

} 

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    width: '100%',
    backgroundColor: 'rgb(29 78 216)',
  },
});


const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontFamily: 'Poppins',
  fontWeight: '500',
  fontSize: theme.typography.pxToRem(12),
  color: '#666666',
  '&.Mui-selected': {
    color: 'rgb(29 78 216)',
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#666666',
  },
}));

// Hook Definitions
function StudentAttendanceTable() {
  const [value, setValue] = useState(0);

  const [subjectOptions, setSubjectOptions] = useState<SubjectOption[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [studentDetails, setStudentDetails] = useState<studentDetails>({
    studentName: '',
    studentEmail: '',
    studentID: '',
    studentUSN: '',
    studentLabBatch: '',
    classSemester: '',
    className: '',
    uid: '',
  
  });
  const [dataFetched, setDataFetched] = useState(false);
  const [user , setUser] = useState<any>(null);

  // Function to handle tab changes
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  function getDayOfWeek(date) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
  }

                
  const customComparator = (a, b) => {
    const lastCharA = a.value.slice(-1);
    const lastCharB =  b.value.slice(-1);
    if (lastCharA < lastCharB) return -1;
    if (lastCharA > lastCharB) return 1;
    return 0;
  };


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


  async function fetchAttendanceData() {
    try {
      const responseAPI = await fetch(`${window.location.origin}/api/student/attendance`, {
        method: 'GET',
      });
      if (responseAPI.status === 200) {
        const responseBody = await responseAPI.json();
        setStudentDetails(responseBody.studentDetails);
        setSubjectOptions(responseBody.subjectOptions.sort(customComparator));
        setAttendanceData(responseBody.attendanceDocs);
        setDataFetched(true);

        localStorage.setItem('studentDetails', JSON.stringify(responseBody.studentDetails));
        localStorage.setItem('subjectOptions', JSON.stringify(responseBody.subjectOptions));
        localStorage.setItem('attendanceData', JSON.stringify(responseBody.attendanceDocs));

      } else {
        console.log('Cannot fetch data');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
   
  useEffect(() => {
     
    const storedStudentDetails = localStorage.getItem('studentDetails');
    const storedSubjectOptions = localStorage.getItem('subjectOptions');
    const storedAttendanceData = localStorage.getItem('attendanceData');

    if (storedStudentDetails && storedSubjectOptions && storedAttendanceData) {
     
      const parsedStudentDetails = JSON.parse(storedStudentDetails);
      const parsedSubjectOptions = JSON.parse(storedSubjectOptions);
      const parsedAttendanceData = JSON.parse(storedAttendanceData);

      const userUidMatch = parsedStudentDetails.uid === user?.uid;

      if(userUidMatch){
        setStudentDetails(parsedStudentDetails);
        setSubjectOptions(parsedSubjectOptions.sort(customComparator));
        setAttendanceData(parsedAttendanceData);
        setDataFetched(true);
      }
      
    } 

      fetchAttendanceData();
   

  }, [user]);

  const getAttendanceCount = (subjectIndex: number): number => {
    const subjectData = attendanceData[subjectIndex];
    if (Array.isArray(subjectData)) {
      return subjectData.reduce((total, data) => {
        const student = data.attendance?.find((student) => student.usn === studentDetails.studentUSN);
        return total + (student && student.Present ? 1 : 0);
      }, 0);
    }
    return 0; // Return 0 if subjectData is not an array
  };

  // Function to get class count for a subject
  const getClassCount = (subjectIndex: number): number => {
    let count = 0;
    const subjectData = attendanceData[subjectIndex];
    if (Array.isArray(subjectData)) {
      subjectData.forEach((data) => {
        const student = data.attendance?.find((student) => student.usn === studentDetails.studentUSN);
        if (student) {
          count++;
        }
      });
    }
    return count;
  };

  // Function to calculate attendance percentage for a subject
  const getAttendancePercentage = (subjectIndex: number): number => {
    const attendanceCount = getAttendanceCount(subjectIndex);
    const classCount = getClassCount(subjectIndex);
    const percentage = classCount > 0 ? (attendanceCount / classCount) * 100 : 0;
    return parseFloat(percentage.toFixed(2));
  };

  // Calculate total classes held and total classes attended
  const totalClassesHeld = attendanceData.reduce((total, data, index) => total + getClassCount(index), 0);
  const totalClassesAttended = attendanceData.reduce((total, data, index) => total + getAttendanceCount(index), 0);

  // Calculate total attendance percentage
  const totalAttendancePercentage = Math.round((totalClassesAttended / totalClassesHeld) * 100);

  // Filter theory and lab subjects
  const theorySubjects = subjectOptions.filter((subject) => subject.subjectType === 'theory');
  const labSubjects = subjectOptions.filter((subject) => subject.subjectType === 'lab');

  console.log(labSubjects)
  console.log(theorySubjects)

  return (
   
    <>
  
      <div className={styles.contentContainer}>

      <div className={styles.container}>

          <div className={styles.attendanceCard}>
            {dataFetched ? (
              <DonutChart totalAttendancePercentage={totalAttendancePercentage} />
            ) : (
              <Skeleton variant="circular" width={120} height={120} />
            )}
           
            <div style={{ alignItems: 'center' }}>
            <h5 style={{ marginLeft: '10px', fontSize: '16px', marginBottom: '10px' ,width: '200px', maxWidth: '40%',whiteSpace: 'nowrap',fontFamily: 'Poppins',fontWeight: '500',color: '#111' }}>
              {dataFetched ? (
                <>
                  Attendance Summary
                </>
              ) : (
                <Skeleton variant="text" sx={{ fontSize: '1.3rem', width: '100%' }} />
              )}
              </h5>
             
              <p style={{ marginLeft: '10px', marginBottom: '0px', fontSize: '14px', color: '#333',fontWeight: '500' }}>
                {dataFetched ? (
                  <>
                    Classes Held: {totalClassesHeld} <br />
                    Classes Attended: {totalClassesAttended} <br />
                    Classes Absent: {totalClassesHeld - totalClassesAttended}
                  </>
                ) : (
                  <>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  </>
                  
                )}
              </p>
            </div>
          </div>

          <div>
          <h6 style={{ marginTop: '15px', marginLeft: '10px', color: 'grey', fontFamily: 'Poppins', fontWeight: '500',fontSize: '14px' }}>SUBJECTS </h6>
            <MyTabs style={{ marginTop: '10px' }}>
              <MyTabList style={{borderRadius: '10px', marginBottom: '15px'}}>
                <MyTab style={{ width: '50%', textAlign: 'center' }}>Theory</MyTab>
                <MyTab style={{ width: '50%', textAlign: 'center' }}>Lab</MyTab>
              </MyTabList>

              <MyTabPanel>
              <table className={styles.attendanceTable}>
                <thead>
                  <tr >
                    <th className={styles.tableHead} style={{ borderTopLeftRadius: '10px' }}>
                      Subject 
                    </th>
                    <th className={styles.tableHead}>
                      Classes Held
                    </th>
                    <th className={styles.tableHead}>
                      Classes Attended
                    </th>
                    <th className={styles.tableHead} style={{ borderTopRightRadius: '10px',paddingRight: '10px' }}>
                      Attendance Percentage
                    </th>
                  </tr>
                </thead>
              
                <tbody>
                {subjectOptions && studentDetails.classSemester && studentDetails.className ? (
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
                          <td className={styles.tableData}>{getClassCount(originalIndex)}</td>
                          <td className={styles.tableData}>{getAttendanceCount(originalIndex)}</td>
                          <td className={styles.tableData}>{Math.round(getAttendancePercentage(originalIndex))}%</td>
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
                    <td className={styles.tableData}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    </td>
                  </tr>
                  )}
                </tbody>
              </table>
              </MyTabPanel>
              <MyTabPanel>
              <table className={styles.attendanceTable}>
                <thead>
                  <tr>
                    <th className={styles.tableHead} style={{ borderTopLeftRadius: '10px' }}>
                      Subject
                    </th>
                    <th className={styles.tableHead}>
                      Classes Held
                    </th>
                    <th className={styles.tableHead}>
                      Classes Attended
                    </th>
                    <th className={styles.tableHead} style={{ borderTopRightRadius: '10px' }}>
                      Attendance Percentage
                    </th>
                  </tr>
                </thead>
              
                <tbody>
                {subjectOptions && studentDetails.classSemester && studentDetails.className ? (
                  subjectOptions
                    .filter((subject) => subject.subjectType === 'lab')
                    .map((labSubject, filteredIndex) => {
                      // Find the original index in the unfiltered array
                      const originalIndex = subjectOptions.findIndex(subject => subject === labSubject);
                      
                      return (
                        <tr key={filteredIndex}>
                          <td className={styles.tableSubject}>
                            {labSubject.label + ' (' + labSubject.value + ')'}
                          </td>
                          <td className={styles.tableData}>{getClassCount(originalIndex)}</td>
                          <td className={styles.tableData}>{getAttendanceCount(originalIndex)}</td>
                          <td className={styles.tableData}>{Math.round(getAttendancePercentage(originalIndex))}%</td>
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
                    <td className={styles.tableData}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    </td>
                  </tr>
                  )}
                </tbody>
              </table>
              </MyTabPanel>
            </MyTabs>
          </div>

          <h6 style={{ marginTop: '20px', marginBottom: '0px', marginLeft: '10px', color: 'grey', fontFamily: 'Poppins', fontWeight: '500',fontSize: '14px' }}>PREVIOUS CLASSES</h6>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            {dataFetched ? (
              <StyledTabs value={value} onChange={handleChange}   >
              {subjectOptions.map((subject, index) => (
                <StyledTab key={index} label={subject.value} />
              ))}
            </StyledTabs>
            ) : (
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '300px', marginBottom: '5px'}}/>
            )}
          </Box>
          {dataFetched ?  subjectOptions.map((subject, index) => (
            <div key={index} hidden={value !== index}>
              <Card
                style={{
                  width: '100%',
                  boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.04)',
                  position: 'relative',
                  marginTop: '12px',
                  paddingBottom: 0,
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  marginBottom: '12px'
                }}
              >
                <Typography style={{ marginTop: '10px', marginLeft: '10px', fontWeight: '500', color: '#555', fontFamily: 'Poppins' }}>
                  {subject.label} ({subject.value})
                </Typography>
                {getClassCount(index) ? (
                  <div>
                    <Typography style={{ marginTop: '5px', marginLeft: '10px',fontSize: '13px' ,fontFamily: 'Poppins'}}>
                      You have attended {getAttendanceCount(index)} out of {getClassCount(index)} Classes.
                    </Typography>
                    <Typography style={{ marginLeft: '10px' ,fontSize: '13px',fontFamily: 'Poppins'}}>
                      Attendance Percentage: {Math.round(getAttendancePercentage(index))}%
                    </Typography>
                    {getAttendancePercentage(index) > 75 ? (
                      <Typography style={{ marginLeft: '10px',fontSize: '13px', color: 'rgb(92, 128, 104)', margin: '10px',fontFamily: 'Poppins' }}>
                        <div style={{ backgroundColor: 'rgb(214, 237, 221)', padding: '5px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
                          <BsCheckCircleFill style={{ marginRight: '5px' }} /> Your Attendance Requirement is Satisfied
                        </div>
                        
                      </Typography>
                    ) : (
                      <Typography style={{ marginLeft: '10px',fontSize: '13px', color: 'rgb(139, 78, 78)', margin: '10px',fontFamily: 'Poppins' }}>
                        <div style={{ backgroundColor: 'rgb(237, 221, 221)', padding: '5px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
                        <BsXCircleFill style={{ marginRight: '5px' }}  /> You need to attend{' '}
                        {Math.ceil(((0.75 * getClassCount(index)) - getAttendanceCount(index)) / 0.25)} more classes to reach 75%.
                        </div>
                      </Typography>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '15px' }}>
                    <div style={{boxShadow: '0 0 0 1px rgba(0,0,0,.08)', width: '100%',marginLeft: '10px',marginRight: '10px',padding: '20px',borderRadius: '5px'}}>
                    <Typography style={{fontFamily: 'Poppins', fontSize: '14px',color: '#333'}}>No Classes Held</Typography>
                    </div>
                    
                  </div>
                )}
              </Card>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {/* Iterate over attendance data for the selected subject */}
                {attendanceData[index]?.slice().reverse().map((classData, classIndex) => (
                  <>
                  <div key={classIndex} className={styles.cardContainer}>
                    
                  <div className={styles.connector}>
                      <div className={styles.circle}></div>
                    <Typography style={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: '500', color: 'rgb(29 78 216)',marginLeft: '10px' }}>
                    {' '}{new Date(classData.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        ({getDayOfWeek(new Date(classData.date))})
                      </Typography>
                  </div>                  

                  <div className={styles.lineCard}>
                    <div className={styles.line}></div>
                    <Card className={styles.card}  style={{boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)'}}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '30%',
                        left: '5%',
                        color: 'white',
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        backgroundColor: classData.attendance.find((student) => student.usn === studentDetails.studentUSN)?.Present
                          ? 'green' // Set the background color to green if present
                          : 'red', // Set the background color to red if absent
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '12px',
                        fontFamily: 'Poppins'
                      }}
                    >
                      {classData.attendance.find((student) => student.usn === studentDetails.studentUSN)?.Present ? 'P' : 'A'}
                    </div>
                    <CardContent style={{ padding: '10px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          position: 'relative',
                          marginLeft: '15%',
                        }}
                      >
                        <div style={{ cursor: 'pointer', marginRight: '12px' }}>
                          <Typography style={{fontSize: '14px',fontFamily: 'Poppins',fontWeight: '500',color: '#555',display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                            <BiTime style={{marginRight: '5px'}}/>{classData.sessionTime}
                          </Typography>
                        </div>
                        {/* <AiOutlineRightCircle
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            top: '50%',
                            right: '10px',
                            fontSize: '20px',
                            color: '#333',
                          }}
                        /> */}
                      </div>
                      <Typography
                        style={{fontSize: '10px',fontFamily: 'Poppins',fontWeight: '400',color: '#555',marginLeft: '15%',}}
                      >
                        {classData.presentCount + ' out of your ' + (classData.presentCount + classData.absentCount) + ' classmates were present'}
                      </Typography>
                    </CardContent>
                    </Card>
                  </div>  
                    
                  </div>
                  </>
                ))}
              </div>
            </div>
          )) : (
            <Card 
            style={{
              width: '100%',
              boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.04)',
              position: 'relative',
              marginTop: '12px',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '10px'
            }}>
              <Typography>
              <Skeleton variant="text" sx={{ fontSize: '1.3rem', width: '90%'}}/>
              </Typography>
              <Typography>
              <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '80%'}}/>
              </Typography>
              <Typography>
              <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '80%'}}/>
              </Typography>
              <Typography>
              <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '80%'}}/>
              </Typography>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentAttendanceTable;