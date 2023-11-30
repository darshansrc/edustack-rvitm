"use client";
import TopNavbar from "@/app/student/components/topnavbar/TopNavbar";
import { db } from "@/lib/firebase-config";
import { Alert, Button, Input, Modal, Select, Table, message } from "antd";
import useMessage from "antd/es/message/useMessage";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IoChevronBackSharp } from "react-icons/io5";

const MarksEntryForm = () => {
  const [formStep, setFormStep] = useState(1);

  const [classSubjectPairList, setClassSubjectPairList] = useState<any[]>([]);
  const [classId, setClassId] = useState<string>("");
  const [subjectCode, setSubjectCode] = useState<string>("");
  const [testCode, setTestCode] = useState<string>("");
  const [subjectName, setSubjectName] = useState<string>("");
  const [subjectSemester, setSubjectSemester] = useState<string>("");

  const [maximumTestMarks, setMaximumTestMarks] = useState<string>("");
  const [maximumAssignmentMarks, setMaximumAssignmentMarks] =
    useState<string>("");
  const [step1Error, setStep1Error] = useState<string>("");

  const [studentData, setStudentData] = useState<any[]>([]);

  const [studentMarks, setStudentMarks] = useState<{
    [key: string]: {
      obtainedTestMarks: string;
      obtainedAssignmentMarks: string;
    };
  }>({});

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);

  const showConfirmationModal = () => {
    setIsConfirmationModalVisible(true);
  };

  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchClassSubjectPairs = async () => {
      try {
        const res = await fetch(
          `${window.location.origin}/api/faculty/attendance`,
          {}
        );
        const fetchedData = await res.json();
        setClassSubjectPairList(fetchedData?.classSubjectPairList || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClassSubjectPairs();
  }, []);

  const uniqueClassOptions = classSubjectPairList.reduce((acc, pair) => {
    if (!acc[pair.className]) {
      acc[pair.className] = [];
    }
    acc[pair.className].push(pair);
    return acc;
  }, {});

  const handleStepOneSubmit = () => {
    if (!classId || !subjectCode || !testCode) {
      setStep1Error("Please fill all the fields");
      return;
    }

    setFormStep(2);
  };

  useEffect(() => {
    setTimeout(() => {
      setStep1Error("");
    }, 3000);
  }, [step1Error]);

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
          setSubjectSemester(subjectSemester);
        }
      }
    };

    getSubjectData();
  }, [classId, subjectCode]);

  useEffect(() => {
    const getStudents = async () => {
      try {
        if (!classId) {
          // classId is not available, do nothing
          return;
        }

        const res = await fetch(
          `${window.location.origin}/api/faculty/attendance/students`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(classId), // Include classId in the request body
          }
        );

        if (!res.ok) {
          throw new Error("Failed to get students");
        }

        // Handle the response, e.g., parse JSON
        const data = await res.json();
        setStudentData(data.StudentData);
      } catch (error) {
        // Handle errors, e.g., show an error message
        console.error("Error fetching students", error);
      }
    };

    getStudents();
  }, [classId]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "USN",
      dataIndex: "usn",
      key: "usn",
    },
    {
      title: "Test Marks",
      dataIndex: "obtainedTestMarks",
      key: "obtainedTestMarks",
      render: (text, record) =>
        isEditMode ? (
          <Input
            value={studentMarks[record.key]?.obtainedTestMarks}
            placeholder="Test marks"
            onChange={(e) =>
              isEditMode
                ? handleMarksChange(
                    record.key,
                    "obtainedTestMarks",
                    e.target.value
                  )
                : null
            }
            readOnly={!isEditMode}
          />
        ) : (
          <p>
            {studentMarks[record.key]?.obtainedTestMarks
              ? studentMarks[record.key]?.obtainedTestMarks
              : "-"}
          </p>
        ),
    },
    {
      title: "Ass. /Quiz Marks",
      dataIndex: "obtainedAssignmentMarks",
      key: "obtainedAssignmentMarks",
      render: (text, record) =>
        isEditMode ? (
          <Input
            placeholder="Ass. /Quiz Marks"
            value={studentMarks[record.key]?.obtainedAssignmentMarks}
            onChange={(e) =>
              isEditMode
                ? handleMarksChange(
                    record.key,
                    "obtainedAssignmentMarks",
                    e.target.value
                  )
                : null
            }
            readOnly={!isEditMode}
          />
        ) : (
          <p>
            {studentMarks[record.key]?.obtainedAssignmentMarks
              ? studentMarks[record.key]?.obtainedAssignmentMarks
              : "-"}
          </p>
        ),
    },
  ];
  const handleMarksChange = (studentKey, type, value) => {
    setStudentMarks((prevMarks) => ({
      ...prevMarks,
      [studentKey]: {
        ...prevMarks[studentKey],
        [type]: value,
      },
    }));
    console.log(studentMarks);
  };

  useEffect(() => {
    const getSubjectData = async () => {
      if (classId && subjectCode && testCode && subjectSemester) {
        const marksCollectionRef = doc(
          db,
          "database",
          classId,
          "internals",
          subjectSemester + "SEM",
          testCode,
          subjectCode
        );

        try {
          const marksDoc = await getDoc(marksCollectionRef);

          if (marksDoc.exists()) {
            // Data already exists, load the student marks
            const existingData = marksDoc.data();

            messageApi.success("Data loaded successfully!");

            // Assuming your data structure is something like existingData.studentMarks
            setStudentMarks(existingData.studentMarks || {});

            // Other fields if needed
          } else {
            // Data doesn't exist, set default values or leave blank
          }
        } catch (error) {
          console.error("Error fetching marks data:", error);
        }

        // Rest of your code
      }
    };

    getSubjectData();
  }, [classId, subjectCode, testCode]);

  const handleStepTwoSubmit = () => {
    // Check if there are any marks entered
    if (Object.keys(studentMarks).length === 0) {
      messageApi.open({
        type: "error",
        content: "Please fill at least one field!",
      });
      return;
    }

    // Show confirmation modal
    showConfirmationModal();
  };

  const handleConfirmationOk = async () => {
    // Save data to Firestore
    try {
      const marksCollectionRef = doc(
        db,
        "database",
        classId,
        "internals",
        subjectSemester + "SEM",
        testCode,
        subjectCode
      );

      // Construct the data object with student marks and additional information
      const marksData = {
        maxTestMarks: maximumTestMarks,
        maxAssignmentMarks: maximumAssignmentMarks,
        updatedTime: new Date().toISOString(),
        studentMarks: studentMarks,
      };

      // Save data to Firestore
      await setDoc(marksCollectionRef, marksData);

      message.success("Marks saved successfully!");
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving marks:", error);
      message.error("Failed to save marks. Please try again.");
    }

    setIsConfirmationModalVisible(false);
  };

  const handleConfirmationCancel = () => {
    setIsConfirmationModalVisible(false);
  };

  const stepOne = () => (
    <>
      <TopNavbar name="Marks Entry" />
      <div className="flex items-center justify-center flex-col w-full min-h-[100vh] ">
        <div
          className="flex items-center flex-col bg-white rounded-xl mb-[60px] mt-[60px] w-[90vw] max-w-[500px]  p-4"
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 -4px 6px rgba(0,0,0,.04)",
          }}
        >
          <h2 className="text-center font-[Poppins] font-[500] text-xl p-2 my-2 text-gray-700">
            {" "}
            CIE Mark Entry / Update
          </h2>

          <Alert
            message="Please fill all the fields and click on next to enter or update CIE Marks"
            type="info"
            showIcon
            className="w-full mb-4"
          />

          <p className="text-left font-[Poppins] font-[500] text-[12px] mt-4 pl-2 text-slate-600 w-full">
            Class
          </p>
          <Select
            size="large"
            value={classId || undefined}
            onChange={(value) => {
              setClassId(value);
              setSubjectCode("");
            }}
            placeholder="Select Class"
            className="w-full mb-4"
            options={Object.keys(uniqueClassOptions).map((ClassId, index) => ({
              value: ClassId,
              label: `${uniqueClassOptions[ClassId][0].classSemester}-SEM ${ClassId}`,
            }))}
          />

          <>
            <p className="text-left font-[Poppins] font-[500] text-[12px] mt-2 pl-2 text-slate-600 w-full">
              Subject
            </p>
            <Select
              size="large"
              value={subjectCode || undefined}
              onChange={(value) => setSubjectCode(value)}
              className="w-full mb-2"
              placeholder="Select Subject"
              options={uniqueClassOptions[classId]?.map((pair, index) => ({
                value: pair.code,
                label: pair.subjectName + " (" + pair.code + ")",
              }))}
            />
          </>

          <>
            <p className="text-left font-[Poppins] font-[500] text-[12px] mt-2 pl-2 text-slate-600 w-full">
              CIE code
            </p>
            <Select
              size="large"
              value={testCode || undefined}
              onChange={(value) => setTestCode(value)}
              className="w-full mb-2"
              placeholder="Select Test"
              options={[
                { value: "CIE-1", label: "CIE-1" },
                { value: "CIE-2", label: "CIE-2" },
                { value: "CIE-3", label: "CIE-3" },
              ]}
            />
          </>

          {step1Error && (
            <Alert
              message={step1Error}
              type="error"
              showIcon
              className="w-full mb-4"
            />
          )}

          <Button
            block
            type="primary"
            size="large"
            className="my-4"
            onClick={handleStepOneSubmit}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
  const stepTwo = () => (
    <>
      <div className="flex items-center  flex-col w-full max-w-full min-h-[100vh] ">
        <div className="flex items-center flex-col rounded-xl  w-[95vw] max-w-[900px]  py-4">
          <div className="flex flex-row items-center justify-between md:pb-4 w-[100vw] md:w-[95vw] md:relative fixed top-0 left-0 bg-white md:bg-transparent z-[1000] md:max-w-[900px] border-b border-solid border-gray-50 md:border-collapse">
            <button
              onClick={() => {
                setFormStep(1);
                setStudentMarks({});
                setTestCode("");
                setSubjectCode("");
                setClassId("");
                setMaximumAssignmentMarks("");
                setMaximumTestMarks("");
              }}
              className=" p-2 items-center justify-center m-4 flex flex-row bg-slate-50 rounded-[20px]"
            >
              <IoChevronBackSharp />{" "}
            </button>

            <h4 className="font-[Poppins] text-slate-800 font-[500]  my-4">
              Internals Marks Entry
            </h4>

            <div></div>
          </div>

          <div className="flex flex-col border border-solid border-slate-200 rounded-lg my-2 w-[95vw] p-[10px] mt-16 md:mt-0 max-w-[900px]">
            <h4 className="pl-1 text-[#0577fb;] font-[Poppins] font-[500] text-[16px] pb-1">
              CIE Details
            </h4>
            <p className="pl-1 text-slate-700 font-[Poppins] text-[12px]">
              <span className="font-[500]"> Class: </span> {classId}{" "}
              {subjectSemester}-SEM
            </p>
            <p className="pl-1 text-slate-700 font-[Poppins] text-[12px]">
              <span className="font-[500]"> Subject: </span>
              {subjectName} ({subjectCode}){" "}
            </p>
            <p className="pl-1 text-slate-700 font-[Poppins] text-[12px]">
              <span className="font-[500]"> Test: </span>
              {testCode}
            </p>
          </div>

          <div className="flex flex-col rounded my-2 w-[95vw] max-w-[900px]">
            <Alert
              message="Please enter the test marks and Assignment/Quiz Marks for each student, if Absent put A, if not applicable for test put '-'"
              type="info"
              showIcon
            />
          </div>

          <div className="w-[95vw] max-w-[900px]">
            <div className="flex md:flex-row flex-col md:justify-between gap-4 items-center my-2">
              <div className="flex flex-row align-left w-full  gap-2">
                <div>
                  <p className="text-left font-[Poppins] font-[500] text-[10px]  pl-2 text-slate-600 w-full">
                    Max CIE Marks
                  </p>
                  {isEditMode ? (
                    <Input
                      size="small"
                      value={maximumTestMarks || undefined}
                      onChange={(e) => setMaximumTestMarks(e.target.value)}
                      className="w-full "
                      placeholder="Enter maximum marks"
                    />
                  ) : (
                    <p className="text-left font-[Poppins] font-[500] text-[12px]  pl-2 text-slate-600 w-full">
                      {maximumTestMarks || "-"}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-left font-[Poppins] font-[500] text-[10px]  pl-2 text-slate-600 w-full">
                    Max Assignment/Quiz Marks
                  </p>
                  {isEditMode ? (
                    <Input
                      size="small"
                      value={maximumAssignmentMarks || undefined}
                      onChange={(e) =>
                        setMaximumAssignmentMarks(e.target.value)
                      }
                      className="w-full "
                      placeholder="Enter maximum marks"
                    />
                  ) : (
                    <p className="text-left font-[Poppins] font-[500] text-[12px]  pl-2 text-slate-600 w-full">
                      {maximumAssignmentMarks || "-"}
                    </p>
                  )}
                </div>
              </div>

              <div className="h-full flex items-center w-full justify-end ">
                <Button
                  type={isEditMode ? "default" : "primary"}
                  className="h-full"
                  onClick={() => toggleEditMode()}
                >
                  {isEditMode ? "Cancel" : "Edit Marks"}
                </Button>

                {isEditMode && (
                  <Button
                    type="primary"
                    className="h-full ml-2"
                    onClick={() => handleStepTwoSubmit()}
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
            <Table
              size="small"
              dataSource={studentData.map((student) => ({
                key: student.usn,
                name: student.name,
                usn: student.usn,
              }))}
              columns={columns}
              pagination={false}
              bordered
              className="w-[95vw] max-w-[900px] mt-4  mb-[100px] md:mb-0"
            />
          </div>
        </div>
      </div>

      <Modal
        title="Confirmation"
        open={isConfirmationModalVisible}
        onOk={handleConfirmationOk}
        onCancel={handleConfirmationCancel}
        okText="Yes"
        cancelText="No"
        centered
      >
        <p>Do you want to save the entered marks?</p>
      </Modal>
    </>
  );

  const stepThree = () => (
    <div>
      <h1>Step 3</h1>
      <button onClick={() => setFormStep(1)}>Next</button>
    </div>
  );

  return (
    <>
      {contextHolder}
      {formStep === 1 && stepOne()}
      {formStep === 2 && stepTwo()}
      {formStep === 3 && stepThree()}
    </>
  );
};

export default MarksEntryForm;
