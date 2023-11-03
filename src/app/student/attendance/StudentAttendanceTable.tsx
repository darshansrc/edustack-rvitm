'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { auth, db } from '@/lib/firebase-config';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  collectionGroup,
  query,
  where,
} from 'firebase/firestore';
import DonutChart from './DonutChart';
import { Chart } from 'chart.js/auto';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { AiOutlineRightCircle } from 'react-icons/ai';
import AppBar from '@mui/material/AppBar';
import {
  Tab as MyTab,
  Tabs as MyTabs,
  TabList as MyTabList,
  TabPanel as MyTabPanel,
} from 'react-tabs';
import 'react-datepicker/dist/react-datepicker.css';
import './StudentAttendanceTable.css';
import { Card, CardContent, Typography } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';


// Hook Definitions
function StudentAttendanceTable() {
 
  const [value, setValue] = useState(0);
  const [subjectOptions, setSubjectOptions] = useState<{ value: string; label: string; subjectType: string }[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([{}]);

  const [usn, setUsn] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [classSemester, setClassSemester] = useState('');
  const chartRef = useRef(null);
  const [classId , setClassId] = useState(null);

  // Function to handle tab changes
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Effect Hook: Fetch user details and related data
  useEffect(() => {
    if (user && user.email) {
      const fetchData = async () => {
        const queryPath = 'students'; // Update this to the subcollection path
        const collectionGroupRef = collectionGroup(db, queryPath);
        const studentQuery = query(collectionGroupRef, where('email', '==', user.email));
        const studentSnapshot = await getDocs(studentQuery);
  
        const subjectOptions = [];
        let className : string;
  
        await Promise.all(
          studentSnapshot.docs.map(async (studentDoc) => {
            className = studentDoc.ref.parent.parent.id;
  
            const studentID = studentDoc.ref.id;
  
            const classDocRef = doc(db, 'database', className); // Update with your class collection name
            const classDocSnapshot = await getDoc(classDocRef);
    
            if (classDocSnapshot.exists()) {
              const classSemester = classDocSnapshot.data().currentSemester;
              const studentLabBatch = studentDoc.data().labBatch;
              const studentName = studentDoc.data().name;
              const studentUSN = studentDoc.data().usn;
              const studentEmail = studentDoc.data().email;
              const parentEmail = studentDoc.data().parentEmail;
              const parentPhone = studentDoc.data().parentPhone;
              const studentDetails = {
                studentName,
                parentEmail,
                studentEmail,
                parentPhone,
                studentID,
                studentUSN,
                studentLabBatch,
                classSemester,
                className,
              };
  
              setClassSemester(classSemester);
              setStudentDetails(studentDetails);
              setUsn(studentDetails.studentUSN);
              setClassId(className)
  
              if (className) {
                const classDocRef = doc(db, 'database', className);
                const classDocSnapshot = await getDoc(classDocRef);
  
                if (classDocSnapshot.exists()) {
                  const subjectsCollectionRef = collection(classDocRef, 'subjects'); // Assuming 'subjects' is the subcollection name
                  const subjectDocsSnapshot = await getDocs(subjectsCollectionRef);
  
                  subjectDocsSnapshot.docs.forEach((doc) => {
                    const data = doc.data();
  
                    // Check if the subject is compulsory or elective and if it's elective, check if the user's USN is in the electiveStudents array
                    const isElective = data.compulsoryElective === 'elective';
                    const isUserInElective = isElective && data.electiveStudents.includes(studentDetails.studentUSN);
  
                    // Include the subject only if it's compulsory or if it's elective and the user is in the electiveStudents array
                    if (data.compulsoryElective === 'compulsory' || isUserInElective) {
                      subjectOptions.push({ value: data.code, label: data.name, subjectType: data.theoryLab });
                    }
                  });
  
                  // Define a custom comparator function to sort based on the last digit or alphabet
                  const customComparator = (a, b) => {
                    const lastCharA = a.value.slice(-1);
                    const lastCharB = b.value.slice(-1);
  
                    if (lastCharA < lastCharB) return -1;
                    if (lastCharA > lastCharB) return 1;
                    return 0;
                  };
  
                  // Sort the subjectOptions array using the custom comparator
                  subjectOptions.sort(customComparator);
  
                  setSubjectOptions(subjectOptions);
                }
              }
            }
          })
        );
      };
  
      fetchData();
    }
  }, [user, setClassId]);
  
  
  // Effect Hook: Fetch attendance data for selected subjects and semester

  

  // Effect Hook: Create and update the attendance chart
  useEffect(() => {
    if (chartRef && chartRef.current) {
      const attendancePercentages = attendanceData.map((data, index) => getAttendancePercentage(index));

      const backgroundColors = attendancePercentages.map((percentage) => {

          return 'rgba(127,106,152,1)'; // Green color for attendance above 75

      });

      const ctx = chartRef.current.getContext('2d');

      if (chartRef.current.chart) {
        chartRef.current.chart.destroy(); // Destroy the previous chart instance
      }

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas

      chartRef.current.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: subjectOptions.slice(0, 9).map((option : any) => option.value),
          datasets: [
            {
              label: 'Attendance Percentage',
              data: attendancePercentages,
              backgroundColor: backgroundColors,
              borderColor: 'rgba(75, 192, 192, 0.1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 10,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }, [attendanceData, subjectOptions]);

  // Function to get attendance count for a subject
  const getAttendanceCount = (subjectIndex: any) => {
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
  const getClassCount = (subjectIndex : any) => {
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
  }

  // Function to calculate attendance percentage for a subject
  const getAttendancePercentage = (subjectIndex: number) => {
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

  useEffect(() => {
    async function fetchAttendanceData() {
      try {
        if (subjectOptions && classSemester && classId) {
          const subjectValues = subjectOptions.map((option) => option.value);
          const attendanceRefs = subjectValues.map((subject) =>
            collection(db, 'database', classId, 'attendance', '' + classSemester + 'SEM', subject)
          );
          const attendanceSnapshots = await Promise.all(attendanceRefs.map((ref) => getDocs(ref)));
  
          // Check if any attendance data is null or undefined
          if (attendanceSnapshots.some((snapshot) => !snapshot || !snapshot.docs)) {
            console.error('Error: Firestore query returned null or undefined data.');
            return;
          }
  
          const attendanceDocs = attendanceSnapshots.map((snapshot) => snapshot.docs.map((doc) => doc.data()));
          setAttendanceData(attendanceDocs);
        }
      } catch (error) {
        console.error('Error fetching attendance data from Firestore', error);
      }
    }
  
    if (classId) {
      fetchAttendanceData();
    }
  }, [setAttendanceData, subjectOptions, classSemester, classId]);

  return (
    <>
      <div className='table-containerrr'>
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
          <canvas ref={chartRef} style={{ marginTop: '20px', width: '450px' }}></canvas>
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
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: "#2f2f2f" }}>Subject Code</th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: "#2f2f2f" }}>Classes Held</th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: "#2f2f2f" }}>Classes Attended</th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: "#2f2f2f" }}>Attendance Percentage</th>
                    </tr>
                  </thead>
                  {subjectOptions && classSemester && classId ? (
  <tbody>
    {theorySubjects.map((subject, index) => (
      <tr className={`table-row ${index % 2 === 0 ? "odd-row" : "even-row"}`} key={index}>
        <td className="table-data" style={{ fontSize: '12px' }}>{subject.label + ' (' + subject.value + ')'}</td>
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
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: "#2f2f2f" }}>Subject Code</th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: "#2f2f2f" }}>Classes Held</th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: "#2f2f2f" }}>Classes Attended</th>
                      <th className="table-header" style={{ fontSize: '12px', backgroundColor: "#2f2f2f" }}>Attendance Percentage</th>
                    </tr>
                  </thead>
                  {subjectOptions && classSemester && classId ? (
  <tbody>
    {labSubjects.map((subject, index) => (
      <tr className={`table-row ${index % 2 === 0 ? "odd-row" : "even-row"}`} key={index}>
        <td className="table-data" style={{ fontSize: '12px' }}>{subject.label + ' (' + subject.value + ')'}</td>
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
          { subjectOptions.map((subject, index) => (
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
                        🛑 You need to attend {Math.ceil(((0.75 * getClassCount(index)) - getAttendanceCount(index)) / 0.25)} more classes to reach 75%.
                      </Typography>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '15px' }}> <Typography>No Classes Held</Typography> </div>
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
