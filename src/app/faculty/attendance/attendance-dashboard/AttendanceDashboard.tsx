'use client';
import { db } from '@/lib/firebase-config';
import { Box, Card, CardContent, ListItem, Typography, styled } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import dayjs from 'dayjs';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import styles from './AttendanceDashboard.module.css'
import { AiOutlineRightCircle } from 'react-icons/ai';
import { Timeline } from 'keep-react';
import { CalendarBlank } from 'phosphor-react';





interface AttendanceFormData {
    classId: string;
    subjectCode: string;
    subjectSemester: string;
    classDate: string;
    classStartTime: string;
    classEndTime: string;
    students: {
      studentName: string;
      studentUSN: string;
      isPresent: boolean;
    }[];
    presentCount: number;
    absentCount: number;
    recordedTime: string;
    updatedTime: string;
    recordedByEmail: string;
    recordedByName: string;
    classTopic: string;
    classDescription: string;
  }
  
  interface TimeOption {
    value: string;
    label: string;
  }


  interface StyledTabProps {
    label: string;
    value: any;
  }
  
  interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
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
  
  
  const StyledTab = styled(({ ...props }: StyledTabProps) => (
    <Tab disableRipple {...props}  />
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
  

const AttendanceDashboard = () => {

    const [attendanceFormData, setAttendanceFormData] = useState<AttendanceFormData>({
        classId: '',
        subjectCode: '',
        subjectSemester: '',
        classDate: '',
        classStartTime: '',
        classEndTime: '',
        students: [],
        presentCount: 0,
        absentCount: 0,
        recordedTime: '',
        updatedTime: '',
        recordedByEmail: '',
        recordedByName: '',
        classTopic: '',
        classDescription: '',
      });
    
      const [formStep, setFormStep] = useState<number>(1);
    
      // step 1 states
      const [classDate, setClassDate] = useState<any>(dayjs());
      const [classStartTime, setClassStartTime] = useState<string>('');
      const [classEndTime, setClassEndTime] = useState<string>('');
      const [classId, setClassId] = useState<string>('');
      const [subjectCode, setSubjectCode] = useState<string>('');
      const [isLabSubject, setIsLabSubject] = useState<boolean>(false);
      const [labBatch, setLabBatch] = useState<string>('');
    
    
      // form required data states
      const [classSubjectPairList, setClassSubjectPairList] = useState<any[]>([]);
      const [subjectType, setSubjectType] = useState<string>('theory');
      const [step1Error, setStep1Error] = useState<string>('');
      const [isSubjectElective, setIsSubjectElective] = useState<string>('');
      const [subjectSemester, setSubjectSemester] = useState<string>('');
      const [electiveStudentUSN, setElectiveStudentUSN] = useState<string[]>([]);
    
    
    
      // step 2 states
    
      const [attendance, setAttendance] = useState<any>([]); 
      const [subjectName, setSubjectName] = useState<string>('');
      const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
      const [presentCount, setPresentCount] = useState(0);
      const [absentCount, setAbsentCount] = useState(0);
      const [confirmLoading, setConfirmLoading] = useState(false);
      const [isDataRecorded, setIsDataRecorded] = useState(false);

     
      const [previousAttendanceSessions, setPreviousAttendanceSessions] = useState<any[]>([]);

    

    useEffect(() => {
        const fetchClassSubjectPairs = async () => {
          try {
            const res = await fetch(`${window.location.origin}/api/faculty/attendance`, {});
            const fetchedData = await res.json();
            setClassSubjectPairList(fetchedData?.classSubjectPairList);
            console.log(fetchedData?.classSubjectPairList[0])
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchClassSubjectPairs();
      }, []);

      const [selectedPair, setSelectedPair] = useState(classSubjectPairList[0]);

      useEffect(() => {
        const fetchData = async () => {

          if (classSubjectPairList.length > 0) {
            setSelectedPair(classSubjectPairList[0]); 
          }
        };
    
        fetchData();
      }, [classSubjectPairList]);


      const handleChangeTab = (event, newSelectedPair) => {
        setSelectedPair(newSelectedPair);
    };
    


      // new states
      useEffect(() => {
        console.log(selectedPair)
      }, [selectedPair])


      useEffect(() => {
        const getSubjectData = async () => {
         
        
          if (classId && subjectCode) {
            const subjectCollectionRef = doc(db, 'database', classId, 'subjects', subjectCode);
            const querySnapshot = await getDoc(subjectCollectionRef);
            if(querySnapshot?.data()){
              const subjectType = querySnapshot.data()?.theoryLab;
              const subjectSemester = querySnapshot.data()?.semester;
              const subjectName = querySnapshot.data()?.name;
              const subjectElective = querySnapshot.data()?.compulsoryElective;
    
              const electiveStudents = querySnapshot.data()?.electiveStudents;
              setSubjectName(subjectName);
              setSubjectType(subjectType); 
              setSubjectSemester(subjectSemester);
              setIsSubjectElective(subjectElective);
              setElectiveStudentUSN(electiveStudents);

              console.log(subjectType)
                console.log(subjectSemester)
                console.log(subjectName)
                console.log(subjectElective)
                console.log(electiveStudents)

            }
    
          }
        };
      
        getSubjectData();
      }, [classId, subjectCode]);

      useEffect(() => {
    
        if (selectedPair) {
          const setDataOfTabs = () => {
            setClassId(selectedPair.className);
            setSubjectCode(selectedPair.code);
          };
      
          setDataOfTabs();
        }
      }, [selectedPair]);


      useEffect(() => {
        const fetchPreviousAttendanceSessions = async () => {
          if (subjectCode) {
            const previousSessionsCollectionRef = collection(
              db,
              "database",
              classId,
              "attendance",
              subjectSemester + "SEM",
              subjectCode
            );
      
            const querySnapshot = await getDocs(previousSessionsCollectionRef);
            const sessionsData: {id: any, data: any} [] = [];
      
            querySnapshot.forEach((doc) => {
              sessionsData.push({
                id: doc.id,
                data: doc.data() 
              });
               console.log(doc.data())
            });
      
            setPreviousAttendanceSessions(sessionsData);
            console.log(previousAttendanceSessions)
          }
        };
      
        fetchPreviousAttendanceSessions();
      }, [classId, subjectCode, subjectSemester]);


      const formatTime = (date) => {
        date = new Date(date);
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
      };

  return (

    <div className='w-full flex flex-col justify center items-center'>
        <div className='w-[95vw] max-w-[550px] '>
       
            <Link href='/faculty/attendance/attendance-form'  shallow={true}>
            <button
            className='bg-blue-600 w-[85vw]  max-w-[450px] text-white rounded-[10px] mx-2 mt-2 mb-2 font-[Poppins] p-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300'
          >
            Mark Attendance
          </button>
          </Link>
          <button
            className='bg-slate-100 w-[85vw] max-w-[450px] text-blue-500 rounded-[10px] mx-2  mt-2 mb-2 font-[Poppins] p-2 px-4 hover:bg-slate-200 focus:outline-none focus:ring focus:ring-blue-300'
          >
            Export Attendance
          </button>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
<StyledTabs
        value={selectedPair} 
        onChange={handleChangeTab}
      >
        {classSubjectPairList.map((pair, index) => (
          <StyledTab
            key={index}
            label={`${pair.classSemester}-SEM ${pair.className} - ${pair.code}`}
            value={pair}
         
          />
        ))}
      </StyledTabs>
      </Box>

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
      <Typography
        
        style={{ marginTop: '10px', marginLeft: '10px', fontWeight: '500', color: '#555', fontFamily: 'Poppins', marginBottom :'5px' }}
      >
       {classId} - {subjectName}
      </Typography>
      <Typography
        variant="body1"
        style={{ marginTop: '2px', marginLeft: '10px',fontSize: '13px' ,fontFamily: 'Poppins'}}
        >
        Attendance from {' '}
        {previousAttendanceSessions.length > 0
          ? new Date(previousAttendanceSessions[0].data.classDate).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }
            )
          : 'N/A'}
        {' to '}
        {previousAttendanceSessions.length > 0
          ? new Date(
              previousAttendanceSessions[previousAttendanceSessions.length - 1]
              .data.classDate
            ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : 'N/A'}{' '}

      </Typography>
      <Typography
        variant="body1"
        style={{ marginTop: '2px', marginLeft: '10px',fontSize: '13px' ,fontFamily: 'Poppins'}}
      >
        Total Classes Held: {previousAttendanceSessions.length}
      </Typography>
      <Typography         variant="body1"
        style={{ marginTop: '2px',marginBottom: '10px', marginLeft: '10px',fontSize: '13px' ,fontFamily: 'Poppins'}}>
          Class Average Attendance Percentage: {((previousAttendanceSessions.reduce((total, session) => total + session.data.presentCount, 0) / previousAttendanceSessions.reduce((total, session) => total + session.data.presentCount + session.data.absentCount, 0)) * 100).toFixed(2)}%
        </Typography>
    </Card>
    
    <div className='flex flex-col w-[95vw] max-w-[550px] my-8 px-6 relative'>
    {previousAttendanceSessions.length === 0 ? (
  <ListItem>
    <Typography variant="subtitle1">No data available.</Typography>
  </ListItem>
) : (
  previousAttendanceSessions
    .slice()
    .reverse()
    .map((sessionObj, index) => (
      
        <Timeline key={index} timelineBarType="dashed" gradientPoint={true}>
        <Timeline.Item>
          <Timeline.Point icon={(
            <div className='font-[Poppins] text-[12px] text-slate-800'>
               { previousAttendanceSessions.length - index }
            </div>
          )} />
          <Timeline.Content>
            <Timeline.Time>{new Date(sessionObj.data.classDate).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }
                  )}</Timeline.Time>
            <div className='border border-dashed border-slate-600 rounded bg-white flex flex-col justify-center p-[12px] mt-2 pr-[30px]'>
 
        
            <div className='text-slate-500 font-[Poppins] text-[12px] font-semibold'>
                    <span className='text-blue-500 font-[Poppins] text-[12px]'>Time: </span>{formatTime(sessionObj.data.classStartTime)+'-'+formatTime(sessionObj.data.classEndTime)}
            </div>


            <div className='text-slate-500 font-[Poppins] text-[12px] font-semibold'>
                    <span className='text-blue-500 font-[Poppins] text-[12px]'>Attendance: </span>{sessionObj.data.presentCount} out of{' '}
              {sessionObj.data.presentCount +
                sessionObj.data.absentCount}{' '}
              Present
            </div>

            <div className='text-slate-500 font-[Poppins] text-[12px] font-semibold'>
                    <span className='text-blue-500 font-[Poppins] text-[12px]'>Taken by: </span>{sessionObj.data.recordedByName}
             </div>
                
              <div style={{ cursor: 'pointer', marginRight: '12px' }}>
                
                <div style={{ cursor: 'pointer', marginRight: '12px' }}>
                  <Typography sx={{ fontSize: 16 }}>
                    {sessionObj.data.classTopic ? ('Topic of Class: ' + sessionObj.data.classTopic + '') : ''}
                  </Typography>
                </div>
              </div>

              <AiOutlineRightCircle
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  fontSize: '20px',
                  color: '#9c27b0',
                }}
              />
      


     
        </div>
            </Timeline.Content>
            </Timeline.Item>
            </Timeline>
      <ListItem key={index}>
   
      </ListItem>
     
    ))
)}
 </div>
        </div>
    </div>
  
  )
}

export default AttendanceDashboard