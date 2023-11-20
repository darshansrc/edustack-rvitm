"use client";
import { auth, db } from "@/lib/firebase-config";
import { Button, Input, Modal, Select, message } from "antd";
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { BsStack } from "react-icons/bs";
import { useRouter } from "next/navigation";

interface facultyDetails {
  facultyType: string;
  facultyName: string;
  facultyDepartment: string;
}
interface studentDetails {
  studentName: string;
  studentEmail: string;
  studentID: string;
  studentUSN: string;
  studentLabBatch: string;
  classSemester: string;
  className: string;
}

const ActivatePage = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [enteredEmail, setEnteredEmail] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [studentDetails, setStudentDetails] = useState<studentDetails>({
    studentName: "",
    studentEmail: "",
    studentID: "",
    studentUSN: "",
    studentLabBatch: "",
    classSemester: "",
    className: "",
  });
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [facultyDetails, setFacultyDetails] = useState<facultyDetails>({
    facultyType: "",
    facultyName: "",
    facultyDepartment: "",
  });

  const [accountCreated, setAccountCreated] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsEmailVerified(true);
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleFormSubmit = async () => {
    console.log(enteredEmail);
    console.log(userType);

    if (!enteredEmail || !userType || !password || !confirmPassword) {
      messageApi.open({
        type: "error",
        content: "Please fill all the fields", // Explicitly specify the type here
      });
      return;
    }

    if (password !== confirmPassword) {
      messageApi.open({
        type: "error",
        content: "Passwords do not match", // Explicitly specify the type here
      });
      return;
    }

    if (enteredEmail && userType === "student") {
      const queryPath = "students";
      const collectionGroupRef = collectionGroup(db, queryPath);
      const studentQuery = query(
        collectionGroupRef,
        where("email", "==", enteredEmail)
      );
      const studentSnapshot = await getDocs(studentQuery);

      await Promise.all(
        studentSnapshot.docs.map(async (studentDoc) => {
          const className = studentDoc.ref.parent.parent?.id || "";
          const studentID = studentDoc.ref.id;
          const classDocRef = doc(db, "database", className);
          const classDocSnapshot = await getDoc(classDocRef);

          if (classDocSnapshot.exists()) {
            messageApi.open({
              type: "success",
              content: "Student details fetched",
            });
            const classSemester = classDocSnapshot.data().currentSemester;
            const studentLabBatch = studentDoc.data().labBatch;
            const studentName = studentDoc.data().name;
            const studentUSN = studentDoc.data().usn;
            const studentEmail = studentDoc.data().email;
            const studentDetails = {
              studentName,
              studentEmail,
              studentID,
              studentUSN,
              studentLabBatch,
              classSemester,
              className,
            };
            console.log(studentDetails);
            setStudentDetails(studentDetails as studentDetails);
            setIsModalOpen(true);
          } else {
            messageApi.open({
              type: "error",
              content: "No Records Found", // Explicitly specify the type here
            });
          }
        })
      );
    } else if (enteredEmail && userType === "faculty") {
      const getRef = doc(db, "faculty", enteredEmail);
      const userDoc = await getDoc(getRef);

      if (userDoc.exists()) {
        const facultyDetails = userDoc.data();
        setFacultyDetails(facultyDetails as facultyDetails);
        console.log(facultyDetails);
        setIsModalOpen(true);
        messageApi.open({
          type: "success",
          content: "Faculty details fetched",
        });
      } else {
        messageApi.open({
          type: "error",
          content: "No Records Found", // Explicitly specify the type here
        });
      }
    }
  };

  const handleCreateAccount = async () => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        confirmPassword
      );
      const user = res.user;
      console.log(user);

      if (userType === "student") {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          email: enteredEmail,
          type: "student",
          name: studentDetails.studentName,
          usn: studentDetails.studentUSN,
          labBatch: studentDetails.studentLabBatch,
          semester: studentDetails.classSemester,
          className: studentDetails.className,
        });
      }

      if (userType === "faculty") {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          email: enteredEmail,
          type: "faculty",
          name: facultyDetails.facultyName,
          department: facultyDetails.facultyDepartment,
          facultyType: facultyDetails.facultyType,
        });
      }

      await sendEmailVerification(user);
      messageApi.open({
        type: "success",
        duration: 20,
        content:
          "A Verification link has been sent to your email, please click on it to activate you account.",
      });
      setAccountCreated(true);
      setIsModalOpen(false);
    } catch (error: any) {
      setIsModalOpen(false);
      if (error.message) {
        messageApi.open({
          type: "error",
          content: <>{error.message}</>, // Explicitly specify the type here
        });
      }
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh]">
        <div className="flex flex-col items-center justify-center w-11/12 max-w-[450px]  bg-white rounded-lg border p-4 border-solid border-gray-50">
          <h4 className="font-poppins flex flex-row  my-4 font-semibold  text-[22px] text-gray-700 mt-3">
            <BsStack className="w-8 h-8 text-[#0577fb] pr-2" /> Edustack
          </h4>

          <h4 className="font-poppins  my-4  text-[16px] text-gray-700 mt-3">
            Activate your Account
          </h4>

          <p className="font-poppins w-full text-left pl-2 text-[12px] text-gray-700 mt-3">
            College Mail
          </p>
          <Input
            placeholder="Enter your college email"
            value={enteredEmail}
            type="email"
            onChange={(e) => setEnteredEmail(e.target.value)}
            size="large"
          />

          <p className="font-poppins w-full text-left pl-2 text-[12px] text-gray-700 mt-3">
            User Type
          </p>
          <Select
            value={userType || undefined}
            onChange={setUserType}
            placeholder="Select user type"
            className="w-full"
            size="large"
          >
            <Select.Option value="student">Student</Select.Option>
            <Select.Option value="faculty">Faculty</Select.Option>
          </Select>

          <p className="font-poppins w-full text-left pl-2 text-[12px] text-gray-700 mt-3">
            Choose Password
          </p>
          <Input.Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />

          <p className="font-poppins w-full text-left pl-2 text-[12px] text-gray-700 mt-3">
            Confirm Password
          </p>
          <Input.Password
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter confirm password"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />

          <Button
            onClick={handleFormSubmit}
            type="primary"
            className="w-full h-10 mt-6 mb-2 rounded-lg"
          >
            Next
          </Button>

          <p className="font-poppins  text-[12px] text-gray-700 mt-3 mb-6">
            Already have an account?{" "}
            <a href="/auth/login" className="text-[#0577fb]">
              Login
            </a>
          </p>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCreateAccount}
        centered
        title="Confirm Your Details"
      >
        <div className="p-4">
          {userType === "student" ? (
            <div>
              <div className="mb-2">
                <span className="font-bold">Name:</span>{" "}
                {studentDetails.studentName}
              </div>
              <div className="mb-2">
                <span className="font-bold">Email:</span>{" "}
                {studentDetails.studentEmail}
              </div>
              <div className="mb-2">
                <span className="font-bold">USN:</span>{" "}
                {studentDetails.studentUSN}
              </div>
              <div className="mb-2">
                <span className="font-bold">Lab Batch:</span>{" "}
                {studentDetails.studentLabBatch}
              </div>
              <div className="mb-2">
                <span className="font-bold">Semester:</span>{" "}
                {studentDetails.classSemester}-SEM
              </div>
              <div className="mb-2">
                <span className="font-bold">Class Name:</span>{" "}
                {studentDetails.className}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-2">
                <span className="font-bold">Name:</span>{" "}
                {facultyDetails.facultyName}
              </div>
              <div className="mb-2">
                <span className="font-bold">Designation:</span>{" "}
                {facultyDetails.facultyType}
              </div>
              <div className="mb-2">
                <span className="font-bold">Department:</span>{" "}
                {facultyDetails.facultyDepartment}
              </div>
            </div>
          )}
        </div>
      </Modal>
      {contextHolder}
    </>
  );
};

export default ActivatePage;
