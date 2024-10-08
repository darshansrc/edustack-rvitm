"use client";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase-config";
import dayjs from "dayjs";
import {
  // Alert,
  Box,
  Card,
  ListItem,
  Skeleton,
  Snackbar,
  Typography,
  styled,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Link from "next/link";
import { Timeline } from "keep-react";
import { CiViewList } from "react-icons/ci";
import { TbEdit } from "react-icons/tb";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Affix, Alert, Button, Checkbox, Modal, message } from "antd";
import { BsChatSquareText } from "react-icons/bs";
import { CSVLink } from "react-csv";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";

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
    scrollButtons
    allowScrollButtonsMobile
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

const StyledTab = styled(({ ...props }: StyledTabProps) => (
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

const AttendanceDashboard = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [attendanceFormData, setAttendanceFormData] =
    useState<AttendanceFormData>({
      classId: "",
      subjectCode: "",
      subjectSemester: "",
      classDate: "",
      classStartTime: "",
      classEndTime: "",
      students: [],
      presentCount: 0,
      absentCount: 0,
      recordedTime: "",
      updatedTime: "",
      recordedByEmail: "",
      recordedByName: "",
      classTopic: "",
      classDescription: "",
    });

  const [formStep, setFormStep] = useState<number>(1);

  // step 1 states
  const [classDate, setClassDate] = useState<any>(dayjs());
  const [classStartTime, setClassStartTime] = useState<string>("");
  const [classEndTime, setClassEndTime] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [subjectCode, setSubjectCode] = useState<string>("");
  const [isLabSubject, setIsLabSubject] = useState<boolean>(false);
  const [labBatch, setLabBatch] = useState<string>("");

  const [top, setTop] = useState<number>(46);

  // form required data states
  // form required data states
  // form required data states
  const [classSubjectPairList, setClassSubjectPairList] = useState<any[]>([]);

  useEffect(() => {
    try {
      const storedClassSubjectPairListString = localStorage.getItem(
        "classSubjectPairList"
      );
      if (storedClassSubjectPairListString !== null) {
        const storedList = JSON.parse(storedClassSubjectPairListString);
        setClassSubjectPairList(storedList);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const [subjectType, setSubjectType] = useState<string>("theory");
  const [step1Error, setStep1Error] = useState<string>("");
  const [isSubjectElective, setIsSubjectElective] = useState<string>("");
  const [subjectSemester, setSubjectSemester] = useState<string>("");
  const [electiveStudentUSN, setElectiveStudentUSN] = useState<string[]>([]);

  // step 2 states
  const [attendance, setAttendance] = useState<any>([]);
  const [subjectName, setSubjectName] = useState<string>("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDataRecorded, setIsDataRecorded] = useState(false);
  const [previousAttendanceSessions, setPreviousAttendanceSessions] = useState<
    any[]
  >([]);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedClassData, setSelectedClassData] = useState<any>({});
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<boolean>(false);

  const [attendanceDataFetched, setAttendanceDataFetched] =
    useState<boolean>(false);

  const [user, setUser] = useState<any>(null);

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

  // Daily dairy
  const [classTopic, setClassTopic] = useState<string>("");
  const [classDescription, setClassDescription] = useState<string>("");

  const [topicModalOpen, setTopicModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchClassSubjectPairs = async () => {
      try {
        const res = await fetch(
          `${window.location.origin}/api/faculty/attendance`,
          {}
        );
        const fetchedData = await res.json();

        // Store classSubjectPairList in localStorage
        localStorage.setItem(
          "classSubjectPairList",
          JSON.stringify(fetchedData?.classSubjectPairList)
        );
        setClassSubjectPairList(fetchedData?.classSubjectPairList || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClassSubjectPairs();
  }, []);

  const [selectedPair, setSelectedPair] = useState(classSubjectPairList[0]);
  const [successMessageOpen, setSuccessMessageOpen] = useState<boolean>(false);
  const [errorMessageOpen, setErrorMessageOpen] = useState<boolean>(false);

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

  useEffect(() => {
    console.log(selectedPair);
  }, [selectedPair]);

  useEffect(() => {
    const getSubjectData = async () => {
      if (classId && subjectCode) {
        const subjectCollectionRef = doc(
          db,
          "database",
          classId,
          "subjects",
          subjectCode
        );
        const querySnapshot = await getDoc(subjectCollectionRef);
        if (querySnapshot?.data()) {
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
          setTimeout(() => {
            setIsDataRecorded(true);
          }, 1000);
        }
      }
    };

    getSubjectData();
  }, [classId, subjectCode]);

  useEffect(() => {
    if (previousAttendanceSessions && subjectName) {
      setAttendanceDataFetched(true);
    }
  }, [previousAttendanceSessions, subjectName]);

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
        const sessionsData: { id: any; data: any }[] = [];

        querySnapshot.forEach((doc) => {
          sessionsData.push({
            id: doc.id,
            data: doc.data(),
          });
          console.log(doc.data());
        });

        setPreviousAttendanceSessions(sessionsData);

        setUpdateData(false);
        console.log(previousAttendanceSessions);
      }
    };

    fetchPreviousAttendanceSessions();
  }, [classId, subjectCode, subjectSemester, updateData]);

  const formatTime = (date) => {
    date = new Date(date);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const EditModal = () => {
    const [editedClassData, setEditedClassData] = useState(selectedClassData);
    const [dataEditedSuccessfully, setDataEditedSuccessfully] = useState(true);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
      setEditedClassData(selectedClassData);
    }, [editModalOpen, editMode, selectedClassData]);

    const handleCheckboxChange = (index) => {
      if (editMode) {
        const updatedStudents = [...editedClassData.students];
        const student = updatedStudents[index];

        const prevCount = editedClassData.presentCount;
        const newPresentCount = student.Present ? prevCount - 1 : prevCount + 1;
        const newAbsentCount =
          editedClassData.students.length - newPresentCount;

        student.Present = !student.Present;

        setEditedClassData({
          ...editedClassData,
          students: updatedStudents,
          presentCount: newPresentCount,
          absentCount: newAbsentCount,
          updatedTime: new Date().toISOString(),
        });
      }
    };

    const handleEditButtonClick = () => {
      setEditMode(true);
    };

    const handleSaveChanges = async () => {
      setDataEditedSuccessfully(false);
      console.log("Edited Data:", editedClassData);

      try {
        const res = await fetch(
          `${window.location.origin}/api/faculty/attendance/submit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedClassData),
          }
        );

        if (res.ok) {
          console.log("Form data submitted successfully");
          setDataEditedSuccessfully(true);
          setEditedClassData(selectedClassData);

          setSuccessMessageOpen(true);
          messageApi.open({
            type: "success",
            content: "Attendance edited Successfully",
          });
          setUpdateData(true);
          setEditModalOpen(false);
        }

        if (!res.ok) {
          setEditedClassData(selectedClassData);
          setErrorMessageOpen(true);

          messageApi.open({
            type: "error",
            content: "Failed to editAttendance",
          });

          setEditModalOpen(false);
          throw new Error("Failed to submit form data");
        }
      } catch (error) {
        console.log("Unable to save changes");
        setEditedClassData(selectedClassData);
        setEditModalOpen(false);
        setErrorMessageOpen(true);
      }
    };

    const handleModalClose = () => {
      setEditedClassData(selectedClassData);
      setEditModalOpen(false);
    };

    return (
      <Modal
        title="Edit Attendance"
        open={editModalOpen}
        centered
        onOk={() => setEditModalOpen(false)}
        onCancel={handleModalClose}
        footer={[
          <Button
            key="edit"
            type="primary"
            className="bg-[#0577fb]"
            onClick={handleEditButtonClick}
            disabled={editMode}
          >
            Edit
          </Button>,
          <Button
            key="save"
            type="primary"
            className="bg-[#0577fb]"
            onClick={handleSaveChanges}
            disabled={!editMode}
          >
            {dataEditedSuccessfully ? "Save Changes" : "Updating"}
          </Button>,
          <Button key="cancel" type="default" onClick={handleModalClose}>
            Cancel
          </Button>,
        ]}
      >
        <div className="border border-solid border-slate-200 rounded bg-white flex flex-col justify-center p-[10px]  pr-[30px] mt-4">
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Subject:{" "}
            </span>
            {subjectName}
          </div>
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Date:{" "}
            </span>
            {new Date(selectedClassData.classDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Time:{" "}
            </span>
            {formatTime(selectedClassData.classStartTime) +
              "-" +
              formatTime(selectedClassData.classEndTime)}
          </div>
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Attendance:{" "}
            </span>{" "}
            {selectedClassData.students
              ? `${
                  selectedClassData.students.filter(
                    (student) => student.Present
                  ).length
                } out of ${selectedClassData.students.length}`
              : ""}{" "}
            {" Present"}
          </div>
          {selectedClassData.labBatch && (
            <div className="text-slate-500 font-[Poppins] text-[12px] ">
              <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
                Lab Batch:{"B-"}
              </span>
              {selectedClassData.labBatch}
            </div>
          )}
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Taken by:{" "}
            </span>
            {selectedClassData.recordedByName}
          </div>
        </div>
        <div className="max-h-[50vh] h-[50vh] overflow-y-auto table-auto border border-slate-200 rounded mt-2">
          <table className="w-full">
            <thead className="bg-[#fafafa] z-50">
              <tr>
                <th className="sticky top-0 bg-[#fafafa]  text-[12px] px-4 text-left z-50  py-[5px]">
                  Name
                </th>
                <th className="sticky top-0 bg-[#fafafa]  text-[12px] px-4 text-left z-50  py-[5px]">
                  USN
                </th>
                <th className="sticky top-0 bg-[#fafafa]  text-[12px] px-4 text-left z-50  py-[5px]">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody>
              {editedClassData.students?.map((student, index) => (
                <tr key={index}>
                  <td className="border-y border-slate-100 px-2 text-[12px] font-[Poppins]">
                    {student.name}
                  </td>
                  <td className="border-y border-slate-100 px-2 text-[12px] font-[Poppins]">
                    {student.usn}
                  </td>
                  <td className="border-y border-slate-100 px-2 text-[12px] font-[Poppins] text-center">
                    {/* Use Checkbox instead of static text */}
                    <Checkbox
                      checked={student.Present}
                      onChange={() => handleCheckboxChange(index)}
                      disabled={!editMode}
                      style={{
                        color: editMode ? "" : "#f0f0f0",
                        borderColor: "#d9d9d9",
                      }}
                    >
                      {student.Present ? "P" : "A"}
                    </Checkbox>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Your content */}
        {/* ... */}
      </Modal>
    );
  };

  const ViewModal = () => {
    const generateCSVData = () => {
      // Check if selectedClassData.students exists before mapping
      const csvData =
        selectedClassData.students?.map((student) => [
          student.name,
          student.usn,
          student.Present ? "P" : "A",
        ]) || [];

      // Add header row
      csvData.unshift(["Name", "USN", "Attendance"]);

      return csvData;
    };

    return (
      <Modal
        title="View Attendance"
        open={viewModalOpen}
        centered
        onOk={() => setViewModalOpen(false)}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <CSVLink
            key="export-csv"
            data={generateCSVData()}
            filename={`Attendance-${subjectName}-${new Date(
              selectedClassData.classDate
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}-${formatTime(selectedClassData.classStartTime)}-${formatTime(
              selectedClassData.classEndTime
            )}.csv`}
            className=" bg-[#0577fb] px-4 py-2 text-white rounded"
          >
            Download CSV
          </CSVLink>,

          <Button
            key="submit"
            onClick={() => setViewModalOpen(false)}
            className="ml-4 bg-slate-50 rounded border border-slate-100"
          >
            Close
          </Button>,
        ]}
      >
        <div className="border border-solid border-slate-200 rounded bg-white flex flex-col justify-center p-[10px]  pr-[30px] mt-4">
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Subject:{" "}
            </span>
            {subjectName}
          </div>
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Date:{" "}
            </span>
            {new Date(selectedClassData.classDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Time:{" "}
            </span>
            {formatTime(selectedClassData.classStartTime) +
              "-" +
              formatTime(selectedClassData.classEndTime)}
          </div>
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Attendance:{" "}
            </span>{" "}
            {selectedClassData.students
              ? `${
                  selectedClassData.students.filter(
                    (student) => student.Present
                  ).length
                } out of ${selectedClassData.students.length}`
              : ""}{" "}
            {" Present"}
          </div>
          {selectedClassData.labBatch && (
            <div className="text-slate-500 font-[Poppins] text-[12px] ">
              <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
                Lab Batch:{"B-"}
              </span>
              {selectedClassData.labBatch}
            </div>
          )}
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Taken by:{" "}
            </span>
            {selectedClassData.recordedByName}
          </div>
        </div>
        <div className="max-h-[50vh] h-[50vh] overflow-y-auto table-auto  border border-slate-200 rounded mt-2">
          <table className="w-full ">
            <thead className="bg-[#fafafa] ">
              <tr>
                <th className="sticky top-0 bg-[#fafafa]  text-[12px] px-4 text-left py-[5px]">
                  Name
                </th>
                <th className="sticky top-0 bg-[#fafafa]  text-[12px] px-4 text-left py-[5px]">
                  USN
                </th>
                <th className="sticky top-0 bg-[#fafafa]  text-[12px] px-4 text-left py-[5px]">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedClassData.students?.map((student, index) => (
                <tr key={index}>
                  <td className="border-y border-slate-100 px-2 text-[12px] font-[Poppins]">
                    {student.name}
                  </td>
                  <td className="border-y border-slate-100 px-2 text-[12px] font-[Poppins] ">
                    {student.usn}
                  </td>
                  <td className="border-y border-slate-100 px-2 text-[12px] font-[Poppins] text-center">
                    {student.Present ? "P" : "A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    );
  };

  const handleViewClick = (sessionObjId) => {
    setViewModalOpen(true);
  };

  const handleEditClick = (sessionObjId) => {
    setEditModalOpen(true);
  };

  const ClassTopicModal = () => {
    const [editedClassTopic, setEditedClassTopic] = useState(selectedClassData);
    const [editedTopic, setEditedTopic] = useState<string>(
      editedClassTopic.classTopic || ""
    );
    const [editedDescription, setEditedDescription] = useState<string>(
      editedClassTopic.classDescription || ""
    );
    const [editMode, setEditMode] = useState(
      !editedClassTopic.classTopic && !editedClassTopic.classDescription
    );

    const [topicEditedSuccessfully, setTopicEditedSuccessfully] =
      useState(true);

    useEffect(() => {
      setEditedClassTopic(selectedClassData);
      setEditedTopic(selectedClassData.classTopic || "");
      setEditedDescription(selectedClassData.classDescription || "");
      setEditMode(
        !selectedClassData.classTopic && !selectedClassData.classDescription
      );
    }, [selectedClassData]);

    const handleEditButtonClick = () => {
      setEditMode(true);
    };

    const handleSaveChanges = async () => {
      setTopicEditedSuccessfully(false);
      setEditedClassTopic({
        ...selectedClassData,
        classTopic: editedTopic,
        classDescription: editedDescription,
      });

      try {
        const res = await fetch(
          `${window.location.origin}/api/faculty/attendance/submit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...selectedClassData,
              classTopic: editedTopic,
              classDescription: editedDescription,
            }),
          }
        );

        if (res.ok) {
          console.log("Form data submitted successfully");
          setSuccessMessageOpen(true);
          messageApi.open({
            type: "success",
            content: "Topic Updated Successfully",
          });
          setUpdateData(true);
          setTopicModalOpen(false);
          setTopicEditedSuccessfully(true);
        } else {
          setErrorMessageOpen(true);
          messageApi.open({
            type: "error",
            content: "Failed to Update",
          });
          setTopicModalOpen(false);
          setTopicEditedSuccessfully(true);
          throw new Error("Failed to submit form data");
        }
      } catch (error) {
        console.log("Unable to save changes");
        setEditModalOpen(false);
        setErrorMessageOpen(true);
        setTopicEditedSuccessfully(true);
      }

      setTopicModalOpen(false);
    };

    const handleModalClose = () => {
      setEditedTopic(selectedClassData.classTopic || "");
      setEditedDescription(selectedClassData.classDescription || "");
      setEditMode(
        !selectedClassData.classTopic && !selectedClassData.classDescription
      );
      setTopicModalOpen(false);
    };

    return (
      <Modal
        title="Class Description"
        open={topicModalOpen}
        centered
        onOk={handleSaveChanges}
        onCancel={handleModalClose}
        footer={[
          editMode ? (
            <Button
              key="save"
              type="primary"
              className="bg-[#0577fb]"
              onClick={handleSaveChanges}
            >
              {topicEditedSuccessfully ? "Save Changes" : "Updating..."}
            </Button>
          ) : (
            <Button
              key="edit"
              type="primary"
              className="bg-[#0577fb]"
              onClick={handleEditButtonClick}
            >
              Edit
            </Button>
          ),
          <Button key="cancel" type="default" onClick={handleModalClose}>
            Cancel
          </Button>,
        ]}
      >
        <div className="border border-solid border-slate-200 rounded bg-white flex flex-col justify-center p-[10px]  pr-[30px] mt-4">
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Subject:{" "}
            </span>
            {subjectName}
          </div>
          <div className="text-slate-500 font-[Poppins] text-[12px]">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Date:{" "}
            </span>
            {new Date(selectedClassData.classDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Time:{" "}
            </span>
            {formatTime(selectedClassData.classStartTime) +
              "-" +
              formatTime(selectedClassData.classEndTime)}
          </div>
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Attendance:{" "}
            </span>{" "}
            {selectedClassData.students
              ? `${
                  selectedClassData.students.filter(
                    (student) => student.Present
                  ).length
                } out of ${selectedClassData.students.length}`
              : ""}{" "}
            {" Present"}
          </div>
          <div className="text-slate-500 font-[Poppins] text-[12px] ">
            <span className="text-[#0577fb] font-[Poppins] text-[12px] font-semibold">
              Taken by:{" "}
            </span>
            {selectedClassData.recordedByName}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-[#0577fb] mt-4"
          >
            Topic of Class
          </label>
          {editMode ? (
            <input
              id="topic"
              placeholder="Enter topic of class"
              value={editedTopic}
              onChange={(e) => setEditedTopic(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full focus:border-blue-300 border-1px"
            />
          ) : (
            <div className="mt-1 p-2 border rounded-md w-full ">
              {editedTopic}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#0577fb]"
          >
            Class Description
          </label>
          {editMode ? (
            <textarea
              id="description"
              placeholder="Enter description of class"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full focus:border-blue-300 border-1px"
            />
          ) : (
            <div className="mt-1 p-2 border h-12 rounded-md w-full ">
              {editedDescription}
            </div>
          )}
        </div>
      </Modal>
    );
  };

  const generateCSVData = () => {
    // Check if selectedClassData.students exists before mapping
    const csvData =
      selectedClassData.students?.map((student) => [
        student.name,
        student.usn,
        student.Present ? "P" : "A",
      ]) || [];

    // Add header row
    csvData.unshift(["Name", "USN", "Attendance"]);

    return csvData;
  };

  const formatRecordedTime = (isoString) => {
    const date = new Date(isoString);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);

    return formattedDate;
  };

  const isDataLoaded = Boolean(classId && subjectName);

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center bg-[#F9FAFB] ">
        <div className="w-[95vw] max-w-[550px] mt-16 md:mt-0  ">
          <Link href="/faculty/attendance/attendance-form" shallow={true}>
            <button className="bg-[#0577fb] w-full  max-w-[550px] text-white rounded-[10px]  mt-2 mb-2 font-[Poppins] p-2 px-4 hover:bg-[#0577fb] focus:outline-none focus:ring focus:ring-blue-300 md:hidden">
              Mark Attendance
            </button>
          </Link>
          <Link href="/faculty/attendance/export-attendance" shallow={true}>
            <button className="bg-slate-100 w-full max-w-[550px] text-[#0577fb] rounded-[10px]   mt-2 mb-2 font-[Poppins] p-2 px-4 hover:bg-slate-200 focus:outline-none focus:ring focus:ring-blue-300 md:hidden">
              Export Attendance
            </button>
          </Link>

          <Alert
            message="Welcome! Manage attendance, Modules teached, Class topic and class details easily. Students can also view their attendance on their dashboards."
            type="info"
            showIcon
            className="my-3 md:hidden"
          />
        </div>

        <div className=" sticky z-[50] md:bg-white bg-[#fafafa] w-full max-w-full">
          <h4 className="pl-4  font-poppins  font-semibold bg-white w-full  text-gray-800  text-[14px] md:text-[18px]">
            Your Subjects
          </h4>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider" }}
            className="bg-white"
          >
            <StyledTabs value={selectedPair} onChange={handleChangeTab}>
              {classSubjectPairList.map((pair, index) => (
                <StyledTab
                  key={index}
                  label={`${pair.className} - ${pair.code}`}
                  value={pair}
                />
              ))}
            </StyledTabs>
          </Box>
        </div>

        <div>
          <Card
            sx={{
              width: "100%",
              boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.04)",
              position: "relative",
              marginTop: "12px",
              paddingBottom: 0,
              backgroundColor: "white",
              borderRadius: "10px",
              marginBottom: "12px",
              maxWidth: "550px",
            }}
          >
            {classId && subjectName ? (
              <>
                <Typography
                  sx={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    fontWeight: "500",
                    color: "#555",
                    fontFamily: "Poppins",
                    marginBottom: "5px",
                  }}
                >
                  {`${classId} - ${subjectName}`}
                </Typography>
                {previousAttendanceSessions.length > 0 ? (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        marginTop: "2px",
                        marginLeft: "10px",
                        fontSize: "13px",
                        fontFamily: "Poppins",
                      }}
                    >
                      Attendance from{" "}
                      {new Date(
                        previousAttendanceSessions[0].data.classDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      to{" "}
                      {new Date(
                        previousAttendanceSessions[
                          previousAttendanceSessions.length - 1
                        ].data.classDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        marginTop: "2px",
                        marginLeft: "10px",
                        fontSize: "13px",
                        fontFamily: "Poppins",
                      }}
                    >
                      Total Classes Held: {previousAttendanceSessions.length}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        marginTop: "2px",
                        marginBottom: "10px",
                        marginLeft: "10px",
                        fontSize: "13px",
                        fontFamily: "Poppins",
                      }}
                    >
                      Class Average Attendance Percentage:{" "}
                      {(
                        (previousAttendanceSessions.reduce(
                          (total, session) => total + session.data.presentCount,
                          0
                        ) /
                          previousAttendanceSessions.reduce(
                            (total, session) =>
                              total +
                              session.data.presentCount +
                              session.data.absentCount,
                            0
                          )) *
                        100
                      ).toFixed(2)}
                      %
                    </Typography>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-12">
                    <Typography
                      variant="body1"
                      sx={{
                        marginTop: "2px",
                        marginLeft: "10px",
                        fontSize: "13px",
                        fontFamily: "Poppins",
                      }}
                    >
                      {isDataRecorded && "No classes held."}
                    </Typography>
                  </div>
                )}
              </>
            ) : (
              <div className="pl-4 py-4">
                <Skeleton width={"90%"} height={24} className="pb-4" />
                <Skeleton width={"70%"} height={18} />
                <Skeleton width={"70%"} height={18} />
                <Skeleton width={"70%"} height={18} />
              </div>
            )}
          </Card>

          <div className="flex flex-col w-[95vw] max-w-[550px] my-8 px-6 relative">
            {previousAttendanceSessions.length === 0 ? (
              <ListItem>
                <Typography variant="subtitle1"></Typography>
              </ListItem>
            ) : (
              previousAttendanceSessions
                .slice()
                .reverse()
                .map((sessionObj, index) => (
                  <>
                    <Timeline
                      key={index}
                      timelineBarType="dashed"
                      gradientPoint={true}
                    >
                      <Timeline.Item>
                        <Timeline.Point
                          icon={
                            <div className="font-[Poppins] text-[12px] text-slate-800">
                              {previousAttendanceSessions.length - index}
                            </div>
                          }
                        />
                        <Timeline.Content>
                          <Timeline.Time>
                            {new Date(
                              sessionObj.data.classDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              weekday: "short",
                            })}
                          </Timeline.Time>
                          <div className="border border-solid border-slate-200 rounded bg-white flex flex-col justify-center p-[10px]  pr-[30px]">
                            <div className="text-slate-500 font-[Poppins] text-[12px] ">
                              <span className=" font-[Poppins] text-[12px] font-semibold">
                                Time:{" "}
                              </span>
                              {formatTime(sessionObj.data.classStartTime) +
                                "-" +
                                formatTime(sessionObj.data.classEndTime)}
                            </div>
                            <div className="text-slate-500 font-[Poppins] text-[12px] ">
                              <span className=" font-[Poppins] text-[12px] font-semibold">
                                Attendance:{" "}
                              </span>
                              {sessionObj.data.students
                                ? `${
                                    sessionObj.data.students.filter(
                                      (student) => student.Present
                                    ).length
                                  } out of ${sessionObj.data.students.length}`
                                : ""}{" "}
                              {" Present"}
                            </div>

                            {sessionObj.data.labBatch && (
                              <div className="text-slate-500 font-[Poppins] text-[12px] ">
                                <span className=" font-[Poppins] text-[12px] font-semibold">
                                  Lab Batch:{"B-"}
                                </span>
                                {sessionObj.data.labBatch}
                              </div>
                            )}

                            <div className="text-slate-500 font-[Poppins] text-[12px] ">
                              <span className=" font-[Poppins] text-[12px] font-semibold">
                                Recorded by:{" "}
                              </span>
                              {sessionObj.data.recordedByName}
                            </div>

                            <div className="text-slate-500 font-[Poppins] text-[12px] ">
                              <span className=" font-[Poppins] text-[12px] font-semibold">
                                Recorded on:{" "}
                              </span>
                              {sessionObj.data.recordedTime &&
                                formatRecordedTime(
                                  sessionObj.data.recordedTime
                                )}
                            </div>

                            <div className="text-slate-500 font-[Poppins] text-[12px] ">
                              <span className=" font-[Poppins] text-[12px] font-semibold">
                                Topic of Class:{" "}
                              </span>
                              {sessionObj.data.classTopic
                                ? sessionObj.data.classTopic
                                : "-"}
                            </div>

                            <div className="flex flex-row">
                              <button
                                onClick={() => {
                                  handleViewClick(sessionObj.id);
                                  setSelectedClassData(sessionObj.data);
                                }}
                                className=" flex flex-row p-2 bg-slate-100 text-[#0577fb] rounded mx-2 mt-2"
                              >
                                <MdOutlineRemoveRedEye />{" "}
                                <p className="pl-1 marker:font-poppins text-[10px]">
                                  View
                                </p>
                              </button>
                              <button
                                onClick={() => {
                                  handleEditClick(sessionObj.id);
                                  setSelectedClassData(sessionObj.data);
                                }}
                                className="p-2 flex flex-row bg-slate-100 text-[#0577fb] rounded mx-2 mt-2"
                              >
                                <TbEdit />
                                <p className="pl-1 font-poppins text-[10px]">
                                  Edit
                                </p>
                              </button>
                              <button
                                onClick={() => {
                                  setTopicModalOpen(true);
                                  setSelectedClassData(sessionObj.data);
                                }}
                                className="p-2 flex flex-row bg-slate-100 text-[#0577fb] rounded mx-2 mt-2"
                              >
                                <BsChatSquareText />{" "}
                                <p className="pl-1 font-poppins text-[10px]">
                                  Topic
                                </p>
                              </button>
                            </div>
                          </div>
                        </Timeline.Content>
                      </Timeline.Item>
                    </Timeline>
                  </>
                ))
            )}
          </div>
        </div>
      </div>

      <ViewModal />

      <EditModal />

      <ClassTopicModal />

      {contextHolder}
    </>
  );
};

export default AttendanceDashboard;
