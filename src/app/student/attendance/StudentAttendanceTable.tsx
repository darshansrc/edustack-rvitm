"use client";
import React, { useEffect, useState } from "react";
import DonutChart from "./DonutChart";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CalendarOutlined } from "@ant-design/icons";
import {
  Tab as MyTab,
  Tabs as MyTabs,
  TabList as MyTabList,
  TabPanel as MyTabPanel,
} from "react-tabs";
import "react-datepicker/dist/react-datepicker.css";
import "./StudentAttendanceTable.css";
import { Box, Card, Typography } from "@mui/material";
import styles from "./StudentAttendanceTable.module.css";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";
import { BiTime } from "react-icons/bi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import { Alert } from "antd";
import { Timeline } from "keep-react";

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
  length: number;
  filter: any;
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

function convertTo12HourFormat(time) {
  const date = new Date(time);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
    backgroundColor: "#0577fb",
  },
});

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontFamily: "Poppins",
  fontWeight: "500",
  fontSize: theme.typography.pxToRem(12),
  color: "#666666",
  "&.Mui-selected": {
    color: "#0577fb",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#666666",
  },
}));

// Hook Definitions
function StudentAttendanceTable() {
  const [value, setValue] = useState(0);

  const [subjectOptions, setSubjectOptions] = useState<SubjectOption[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [studentDetails, setStudentDetails] = useState<studentDetails>({
    studentName: "",
    studentEmail: "",
    studentID: "",
    studentUSN: "",
    studentLabBatch: "",
    classSemester: "",
    className: "",
    uid: "",
  });
  const [dataFetched, setDataFetched] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Function to handle tab changes
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  function getDayOfWeek(date) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
      console.log(user);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  async function fetchAttendanceData() {
    try {
      const responseAPI = await fetch(
        `${window.location.origin}/api/student/attendance`,
        {
          method: "GET",
        }
      );
      if (responseAPI.status === 200) {
        const responseBody = await responseAPI.json();
        setStudentDetails(responseBody.studentDetails);
        setSubjectOptions(responseBody.subjectOptions);
        setAttendanceData(responseBody.attendanceDocs);
        setDataFetched(true);

        localStorage.setItem(
          "studentDetails",
          JSON.stringify(responseBody.studentDetails)
        );
        localStorage.setItem(
          "subjectOptions",
          JSON.stringify(responseBody.subjectOptions)
        );
        localStorage.setItem(
          "attendanceData",
          JSON.stringify(responseBody.attendanceDocs)
        );
      } else {
        console.log("Cannot fetch data");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  useEffect(() => {
    const storedStudentDetails = localStorage.getItem("studentDetails");
    const storedSubjectOptions = localStorage.getItem("subjectOptions");
    const storedAttendanceData = localStorage.getItem("attendanceData");

    if (storedStudentDetails && storedSubjectOptions && storedAttendanceData) {
      try {
        const parsedStudentDetails = JSON.parse(storedStudentDetails);
        const parsedSubjectOptions = JSON.parse(storedSubjectOptions);
        const parsedAttendanceData = JSON.parse(storedAttendanceData);

        const userUidMatch = parsedStudentDetails.uid === user?.uid;

        if (userUidMatch) {
          setStudentDetails(parsedStudentDetails);
          setSubjectOptions(parsedSubjectOptions);
          setAttendanceData(parsedAttendanceData);
          setDataFetched(true);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        // Handle the error (e.g., show a message to the user or clear local storage)
      }
    }
    fetchAttendanceData();
  }, [user]);

  const getAttendanceCount = (subjectIndex: number): number => {
    const subjectData = attendanceData[subjectIndex];
    if (Array.isArray(subjectData)) {
      return subjectData.reduce((total, data) => {
        const student = data.students?.find(
          (student) => student.usn === studentDetails.studentUSN
        );
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
        const student = data.students?.find(
          (student) => student.usn === studentDetails.studentUSN
        );
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
    const percentage =
      classCount > 0 ? (attendanceCount / classCount) * 100 : 0;
    return parseFloat(percentage.toFixed(2));
  };

  // Calculate total classes held and total classes attended
  const totalClassesHeld = attendanceData.reduce(
    (total, data, index) => total + getClassCount(index),
    0
  );
  const totalClassesAttended = attendanceData.reduce(
    (total, data, index) => total + getAttendanceCount(index),
    0
  );

  // Calculate total attendance percentage
  const totalAttendancePercentage = Math.round(
    (totalClassesAttended / totalClassesHeld) * 100
  );

  // Filter theory and lab subjects
  const theorySubjects = subjectOptions.filter(
    (subject) => subject.subjectType === "theory"
  );
  const labSubjects = subjectOptions.filter(
    (subject) => subject.subjectType === "lab"
  );

  return (
    <>
      <div className={styles.contentContainer}>
        <div className={styles.container}>
          <div className={styles.attendanceCard}>
            {dataFetched ? (
              <DonutChart
                totalAttendancePercentage={totalAttendancePercentage}
              />
            ) : (
              <Skeleton variant="circular" width={120} height={120} />
            )}

            <div style={{ alignItems: "center" }}>
              <h5
                style={{
                  marginLeft: "10px",
                  fontSize: "16px",
                  marginBottom: "10px",
                  width: "200px",
                  maxWidth: "40%",
                  whiteSpace: "nowrap",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  color: "#111",
                }}
              >
                {dataFetched ? (
                  <>Attendance Summary</>
                ) : (
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1.3rem", width: "100%" }}
                  />
                )}
              </h5>

              <p
                style={{
                  marginLeft: "10px",
                  marginBottom: "0px",
                  fontSize: "14px",
                  color: "#333",
                  fontWeight: "500",
                }}
              >
                {dataFetched ? (
                  <>
                    Classes Held: {totalClassesHeld} <br />
                    Classes Attended: {totalClassesAttended} <br />
                    Classes Absent: {totalClassesHeld - totalClassesAttended}
                  </>
                ) : (
                  <>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </>
                )}
              </p>
            </div>
          </div>

          <div>
            <h6
              style={{
                marginTop: "15px",
                marginLeft: "10px",
                color: "grey",
                fontFamily: "Poppins",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              SUBJECTS{" "}
            </h6>
            <MyTabs style={{ marginTop: "10px" }}>
              <MyTabList style={{ borderRadius: "10px", marginBottom: "15px" }}>
                <MyTab style={{ width: "50%", textAlign: "center" }}>
                  Theory
                </MyTab>
                <MyTab style={{ width: "50%", textAlign: "center" }}>Lab</MyTab>
              </MyTabList>

              <MyTabPanel>
                <table className={styles.attendanceTable}>
                  <thead>
                    <tr>
                      <th
                        className={styles.tableHead}
                        style={{ borderTopLeftRadius: "10px" }}
                      >
                        Subject
                      </th>
                      <th className={styles.tableHead}>Classes Held</th>
                      <th className={styles.tableHead}>Classes Attended</th>
                      <th
                        className={styles.tableHead}
                        style={{
                          borderTopRightRadius: "10px",
                          paddingRight: "10px",
                        }}
                      >
                        Attendance Percentage
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {subjectOptions &&
                    studentDetails.classSemester &&
                    studentDetails.className ? (
                      subjectOptions
                        .filter((subject) => subject.subjectType === "theory")
                        .map((theorySubject, filteredIndex) => {
                          // Find the original index in the unfiltered array
                          const originalIndex = subjectOptions.findIndex(
                            (subject) => subject === theorySubject
                          );

                          return (
                            <tr key={filteredIndex}>
                              <td className={styles.tableSubject}>
                                {theorySubject.label +
                                  " (" +
                                  theorySubject.value +
                                  ")"}
                              </td>
                              <td className={styles.tableData}>
                                {getClassCount(originalIndex)}
                              </td>
                              <td className={styles.tableData}>
                                {getAttendanceCount(originalIndex)}
                              </td>
                              <td className={styles.tableData}>
                                {Math.round(
                                  getAttendancePercentage(originalIndex)
                                )}
                                %
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td className={styles.tableSubject}>
                          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                        </td>
                        <td className={styles.tableData}>
                          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                        </td>
                        <td className={styles.tableData}>
                          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                        </td>
                        <td className={styles.tableData}>
                          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
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
                      <th
                        className={styles.tableHead}
                        style={{ borderTopLeftRadius: "10px" }}
                      >
                        Subject
                      </th>
                      <th className={styles.tableHead}>Classes Held</th>
                      <th className={styles.tableHead}>Classes Attended</th>
                      <th
                        className={styles.tableHead}
                        style={{ borderTopRightRadius: "10px" }}
                      >
                        Attendance Percentage
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {subjectOptions &&
                    studentDetails.classSemester &&
                    studentDetails.className ? (
                      subjectOptions
                        .filter((subject) => subject.subjectType === "lab")
                        .map((labSubject, filteredIndex) => {
                          // Find the original index in the unfiltered array
                          const originalIndex = subjectOptions.findIndex(
                            (subject) => subject === labSubject
                          );

                          return (
                            <tr key={filteredIndex}>
                              <td className={styles.tableSubject}>
                                {labSubject.label +
                                  " (" +
                                  labSubject.value +
                                  ")"}
                              </td>
                              <td className={styles.tableData}>
                                {getClassCount(originalIndex)}
                              </td>
                              <td className={styles.tableData}>
                                {getAttendanceCount(originalIndex)}
                              </td>
                              <td className={styles.tableData}>
                                {Math.round(
                                  getAttendancePercentage(originalIndex)
                                )}
                                %
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td className={styles.tableSubject}>
                          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                        </td>
                        <td className={styles.tableData}>
                          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                        </td>
                        <td className={styles.tableData}>
                          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                        </td>
                        <td className={styles.tableData}>
                          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </MyTabPanel>
            </MyTabs>
          </div>

          <h6 className="mt-[20px] ml-[10px] text-gray-800 font-poppins font-semibold text-sm">
            PREVIOUS CLASSES
          </h6>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            {dataFetched ? (
              <StyledTabs value={value} onChange={handleChange}>
                {subjectOptions.map((subject, index) => (
                  <StyledTab key={index} label={subject.value} />
                ))}
              </StyledTabs>
            ) : (
              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem", width: "300px", marginBottom: "5px" }}
              />
            )}
          </Box>
          {dataFetched ? (
            subjectOptions.map((subject, index) => (
              <div key={index} hidden={value !== index}>
                <Card
                  style={{
                    width: "100%",
                    boxShadow:
                      "0 0 0 1px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.04)",
                    position: "relative",
                    marginTop: "12px",
                    paddingBottom: 0,
                    backgroundColor: "white",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <Typography
                    style={{
                      marginTop: "10px",
                      marginLeft: "10px",
                      fontWeight: "500",
                      color: "#555",
                      fontFamily: "Poppins",
                    }}
                  >
                    {subject.label} ({subject.value})
                  </Typography>
                  {getClassCount(index) ? (
                    <div>
                      <Typography
                        style={{
                          marginTop: "5px",
                          marginLeft: "10px",
                          fontSize: "13px",
                          fontFamily: "Poppins",
                        }}
                      >
                        You have attended {getAttendanceCount(index)} out of{" "}
                        {getClassCount(index)} Classes.
                      </Typography>
                      <Typography
                        style={{
                          marginLeft: "10px",
                          fontSize: "13px",
                          fontFamily: "Poppins",
                        }}
                      >
                        Attendance Percentage:{" "}
                        {Math.round(getAttendancePercentage(index))}%
                      </Typography>
                      {getAttendancePercentage(index) >= 75 ? (
                        <Alert
                          type="success"
                          className="m-2 text-[12px]"
                          showIcon
                          message={`Your attendance requirement is satisifed.`}
                        />
                      ) : (
                        <Alert
                          type="error"
                          className="m-2 text-[12px]"
                          showIcon
                          message={`You
                            need to attend
                            ${Math.ceil(
                              (0.75 * getClassCount(index) -
                                getAttendanceCount(index)) /
                                0.25
                            )}
                            more class to reach 75% Attendance.`}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: "15px",
                      }}
                    >
                      <div
                        style={{
                          boxShadow: "0 0 0 1px rgba(0,0,0,.08)",
                          width: "100%",
                          marginLeft: "10px",
                          marginRight: "10px",
                          padding: "20px",
                          borderRadius: "5px",
                        }}
                      >
                        <Typography
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            color: "#333",
                          }}
                        >
                          No Classes Held
                        </Typography>
                      </div>
                    </div>
                  )}
                </Card>
                <div className="flex flex-col w-[95vw] max-w-[550px] my-8 px-6 relative">
                  {/* Iterate over attendance data for the selected subject */}
                  {attendanceData[index]
                    ?.slice()
                    .reverse()
                    .filter((classData) => {
                      // Check if subjectType is "lab" and labBatch is equal to studentLabBatch
                      if (subject.subjectType === "lab") {
                        return (
                          classData.labBatch === studentDetails.studentLabBatch
                        );
                      }
                      // If subjectType is not "lab", include all attendance data
                      return true;
                    })
                    .map((classData, classIndex) => (
                      <>
                        <Timeline
                          key={classIndex}
                          timelineBarType="dashed"
                          gradientPoint={true}
                        >
                          <Timeline.Item>
                            <Timeline.Point
                              icon={
                                <div className="text-[12px]">
                                  {attendanceData[index]?.filter(
                                    (classData) => {
                                      // Check if subjectType is "lab" and labBatch is equal to studentLabBatch
                                      if (subject.subjectType === "lab") {
                                        return (
                                          classData.labBatch ===
                                          studentDetails.studentLabBatch
                                        );
                                      }
                                      // If subjectType is not "lab", include all attendance data
                                      return true;
                                    }
                                  ).length - classIndex}
                                </div>
                              }
                            />
                            <Timeline.Content>
                              <Timeline.Time>
                                {new Date(
                                  classData.classDate
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                ({getDayOfWeek(new Date(classData.classDate))})
                              </Timeline.Time>
                              <div className="border border-solid border-slate-200 rounded bg-white flex flex-row justify-left items-center p-[10px] w-full">
                                <div
                                  style={{
                                    minWidth: "25px",
                                    minHeight: "25px",
                                    backgroundColor: classData.students.find(
                                      (student) =>
                                        student.usn ===
                                        studentDetails.studentUSN
                                    )?.Present
                                      ? "green" // Set the background color to green if present
                                      : "red", // Set the background color to red if absent
                                  }}
                                  className="flex items-center justify-center text-white rounded-[50%] text-[12px] ml-2 "
                                >
                                  {classData.students.find(
                                    (student) =>
                                      student.usn === studentDetails.studentUSN
                                  )?.Present
                                    ? "P"
                                    : "A"}
                                </div>

                                <div className="ml-4">
                                  <div>
                                    <div>
                                      <p className="flex font-semibold flex-row items-center text-[10px] font-poppins text-gray-700">
                                        <BiTime className="mr-1" />
                                        {"  "}
                                        {convertTo12HourFormat(
                                          classData.classStartTime
                                        )}{" "}
                                        -{" "}
                                        {convertTo12HourFormat(
                                          classData.classEndTime
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-[10px] font-poppins text-gray-700">
                                    {classData.presentCount +
                                      " out of your " +
                                      (classData.presentCount +
                                        classData.absentCount) +
                                      " classmates were present"}
                                  </p>
                                  <p className="text-[10px] font-poppins text-gray-700">
                                    <span className="font-semibold">
                                      Marked By:
                                    </span>{" "}
                                    {classData.recordedByName}
                                  </p>
                                  {classData.classTopic && (
                                    <p className="text-[10px] font-poppins text-gray-700">
                                      <span className="font-semibold">
                                        Class Topic:
                                      </span>{" "}
                                      {classData.classTopic ? (
                                        classData.classTopic
                                      ) : (
                                        <span className="font-italic ">
                                          {" "}
                                          -{" "}
                                        </span>
                                      )}
                                    </p>
                                  )}
                                  {classData.classDescription && (
                                    <p className="text-[10px] font-poppins text-gray-700">
                                      <span className="font-semibold">
                                        Class Description:
                                      </span>{" "}
                                      {classData.classDescription ? (
                                        classData.classDescription
                                      ) : (
                                        <span className="font-italic ">-</span>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Timeline.Content>
                          </Timeline.Item>
                        </Timeline>
                      </>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <Card
              style={{
                width: "100%",
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.04)",
                position: "relative",
                marginTop: "12px",
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
            >
              <Typography>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1.3rem", width: "90%" }}
                />
              </Typography>
              <Typography>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "0.8rem", width: "80%" }}
                />
              </Typography>
              <Typography>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "0.8rem", width: "80%" }}
                />
              </Typography>
              <Typography>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "0.8rem", width: "80%" }}
                />
              </Typography>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentAttendanceTable;
