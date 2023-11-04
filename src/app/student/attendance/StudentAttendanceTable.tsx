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
import { Card, CardContent, Typography } from '@mui/material';
import LoadingSkeleton from './LoadingSkeleton';

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

// Hook Definitions
function StudentAttendanceTable() {
  const [value, setValue] = useState(0);
  const [subjectOptions, setSubjectOptions] = useState<SubjectOption[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [usn, setUsn] = useState('');
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [classSemester, setClassSemester] = useState('');
  const chartRef = useRef<Chart | null>(null);
  const [classId, setClassId] = useState<any>(null);
  const [dataFetched, setDataFetched] = useState(false);

  // Function to handle tab changes
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
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
          setStudentDetails(responseBody.studentDetails);
          setUsn(responseBody.studentDetails.studentUSN);
          setClassId(responseBody.studentDetails.className);
          setClassSemester(responseBody.studentDetails.classSemester);
          setSubjectOptions(responseBody.subjectOptions);
          setAttendanceData(responseBody.attendanceDocs);

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

  const getAttendanceCount = (subjectIndex: number): number => {
    const subjectData = attendanceData[subjectIndex];
    if (Array.isArray(subjectData)) {
      return subjectData.reduce((total, data) => {
        const student = data.attendance?.find((student) => student.usn === usn);
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
        const student = data.attendance?.find((student) => student.usn === usn);
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

  if (!dataFetched) {
    return (
      <LoadingSkeleton/>
    );
  }

  return (
   
    <>
  
      <div className="table-containerrr">
        <div className="table-containerr">
          <div className="attendance-card">
            <DonutChart totalAttendancePercentage={totalAttendancePercentage} />
            <div style={{ alignItems: 'center' }}>
              <h5 style={{ marginLeft: '30px', fontSize: '18px', marginBottom: '10px' }}>Attendance Summary</h5>
              <p style={{ marginLeft: '30px', marginBottom: '0px', fontSize: '14px' }}>
                Classes Held: {totalClassesHeld} <br /> Classes Attended: {totalClassesAttended} <br /> Classes Absent: {totalClassesHeld - totalClassesAttended}
              </p>
            </div>
          </div>

          <div>
            <MyTabs style={{ marginTop: '20px' }}>
              <MyTabList>
                <MyTab style={{ width: '50%', textAlign: 'center' }}>Theory</MyTab>
                <MyTab style={{ width: '50%', textAlign: 'center' }}>Lab</MyTab>
              </MyTabList>

              <MyTabPanel>
                <table className="responsive-table" style={{}}>
                  <thead className="sticky-header">
                    <tr>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: '#2f2f2f' }}>
                        Subject Code
                      </th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: '#2f2f2f' }}>
                        Classes Held
                      </th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: '#2f2f2f' }}>
                        Classes Attended
                      </th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: '#2f2f2f' }}>
                        Attendance Percentage
                      </th>
                    </tr>
                  </thead>
                  {subjectOptions && classSemester && classId ? (
                    <tbody>
                      {theorySubjects.map((subject, index) => (
                        <tr className={`table-row ${index % 2 === 0 ? 'odd-row' : 'even-row'}`} key={index}>
                          <td className="table-data" style={{ fontSize: '12px' }}>
                            {subject.label + ' (' + subject.value + ')'}
                          </td>
                          <td className="table-data">{getClassCount(index)}</td>
                          <td className="table-data">{getAttendanceCount(index)}</td>
                          <td className="table-data">{Math.round(getAttendancePercentage(index))}%</td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody></tbody>
                  )}
                </table>
              </MyTabPanel>
              <MyTabPanel>
                <table className="responsive-table" style={{}}>
                  <thead className="sticky-header">
                    <tr>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: '#2f2f2f' }}>
                        Subject Code
                      </th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: '#2f2f2f' }}>
                        Classes Held
                      </th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: '#2f2f2f' }}>
                        Classes Attended
                      </th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: '#2f2f2f' }}>
                        Attendance Percentage
                      </th>
                    </tr>
                  </thead>
                  {subjectOptions && classSemester && classId ? (
                    <tbody>
                      {labSubjects.map((subject, index) => (
                        <tr className={`table-row ${index % 2 === 0 ? 'odd-row' : 'even-row'}`} key={index}>
                          <td className="table-data" style={{ fontSize: '12px' }}>
                            {subject.label + ' (' + subject.value + ')'}
                          </td>
                          <td className="table-data">{getClassCount(index)}</td>
                          <td className="table-data">{getAttendanceCount(index)}</td>
                          <td className="table-data">{Math.round(getAttendancePercentage(index))}%</td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody></tbody>
                  )}
                </table>
              </MyTabPanel>
            </MyTabs>
          </div>
          <h6 style={{ marginTop: '20px', marginBottom: '10px', marginLeft: '10px', color: 'grey' }}>Subject Wise Details:</h6>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="full width tabs example"
          >
            {subjectOptions.map((subject, index) => (
              <Tab key={index} label={subject.value} />
            ))}
          </Tabs>
          {subjectOptions.map((subject, index) => (
            <div key={index} hidden={value !== index}>
              <Card
                style={{
                  width: '100%',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  marginTop: '12px',
                  paddingBottom: 0,
                  backgroundColor: '#f1f1f1',
                }}
              >
                <Typography style={{ marginTop: '20px', marginLeft: '10px', fontWeight: 'bold' }}>
                  SUBJECT: {subject.label} ({subject.value})
                </Typography>
                {getClassCount(index) ? (
                  <div>
                    <Typography style={{ marginTop: '10px', marginLeft: '10px' }}>
                      You have attended {getAttendanceCount(index)} out of {getClassCount(index)} Classes.
                    </Typography>
                    <Typography style={{ marginLeft: '10px' }}>
                      Attendance Percentage: {Math.round(getAttendancePercentage(index))}%
                    </Typography>
                    {getAttendancePercentage(index) > 75 ? (
                      <Typography style={{ marginLeft: '10px', color: 'green', marginBottom: '20px' }}>
                        ✅ Your Attendance Requirement is Satisfied
                      </Typography>
                    ) : (
                      <Typography style={{ marginLeft: '10px', color: 'red', marginBottom: '20px' }}>
                        🛑 You need to attend{' '}
                        {Math.ceil(((0.75 * getClassCount(index)) - getAttendanceCount(index)) / 0.25)} more classes to reach 75%.
                      </Typography>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '15px' }}>
                    <Typography>No Classes Held</Typography>
                  </div>
                )}
              </Card>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {/* Iterate over attendance data for the selected subject */}
                {attendanceData[index]?.slice().reverse().map((classData, classIndex) => (
                  <Card
                    key={classIndex}
                    style={{
                      width: '100%',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      marginTop: '12px',
                      paddingBottom: 0,
                      backgroundColor: '#f1f1f1',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '30%',
                        left: '5%',
                        color: 'white',
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        backgroundColor: classData.attendance.find((student) => student.usn === usn)?.Present
                          ? 'green' // Set the background color to green if present
                          : 'red', // Set the background color to red if absent
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {classData.attendance.find((student) => student.usn === usn)?.Present ? 'P' : 'A'}
                    </div>
                    <CardContent style={{ padding: '10px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          position: 'relative',
                          marginLeft: '13%',
                        }}
                      >
                        <div style={{ cursor: 'pointer', marginRight: '12px' }}>
                          <Typography sx={{ fontSize: 16 }}>
                            {new Date(classData.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            ({classData.sessionTime})
                          </Typography>
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
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: 'grey',
                          marginTop: '4px',
                          marginLeft: '13%',
                        }}
                      >
                        {classData.presentCount + ' out of your ' + (classData.presentCount + classData.absentCount) + ' classmates were present'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StudentAttendanceTable;