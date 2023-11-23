"use client";
import { auth, db } from "@/lib/firebase-config";
import { Button, Input, Modal, Result, Select, message } from "antd";
import {
  collection,
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
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import Link from "next/link";

interface facultyDetails {
  facultyType: string;
  facultyName: string;
  facultyDepartment: string;
  facultyDesignation: string;
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
    facultyDesignation: "",
  });

  const [submitButtonLoading, setSubmitButtonLoading] =
    useState<boolean>(false);
  const [createAccountLoading, setCreateAccountLoading] =
    useState<boolean>(false);

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

    setSubmitButtonLoading(true);

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
              content: "Student details fetched!",
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
            setSubmitButtonLoading(false);
          } else {
            messageApi.open({
              type: "error",
              content: "No Records Found", // Explicitly specify the type here
            });
            setSubmitButtonLoading(false);
          }
        })
      );
    } else if (enteredEmail && userType === "faculty") {
      const queryPath = "faculty";
      const facultyQuery = query(
        collection(db, queryPath),
        where("facultyEmail", "==", enteredEmail)
      );

      const facultySnapshot = await getDocs(facultyQuery);

      console.log(facultySnapshot.docs);

      await Promise.all(
        facultySnapshot.docs.map(async (facultyDoc) => {
          // Assuming "facultyDetails" is the field containing details in the document
          const facultyDetails = facultyDoc.data();

          if (facultyDetails) {
            messageApi.open({
              type: "success",
              content: "Faculty details fetched!",
            });

            console.log(facultyDetails);
            setFacultyDetails(facultyDetails as facultyDetails);
            setIsModalOpen(true);
            setSubmitButtonLoading(false);
          } else {
            messageApi.open({
              type: "error",
              content: "No Records Found",
            });
            setSubmitButtonLoading(false);
          }
        })
      );
    }
  };

  const handleCreateAccount = async () => {
    try {
      setCreateAccountLoading(true);
      const res = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        confirmPassword
      );
      const user = res.user;

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
          // facultyType: facultyDetails.facultyType,
        });
      }

      await sendEmailVerification(user);

      setCreateAccountLoading(false);
      setAccountCreated(true);

      setEnteredEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
      setIsModalOpen(false);
    } catch (error: any) {
      setIsModalOpen(false);
      if (error.message) {
        messageApi.open({
          type: "error",
          content: <>{error.code}</>, // Explicitly specify the type here
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-[100vw] min-h-[100vh]">
        <div className="flex flex-col items-center justify-center w-11/12 max-w-[450px]  bg-white rounded-lg border p-4 border-solid border-gray-50">
          {accountCreated ? (
            <>
              <Result
                status="success"
                title="Account Created Successfully!"
                subTitle="Please check your email for a verification link. Click on it to activate your account."
                extra={[
                  <Button
                    key="login"
                    type="primary"
                    className="mt-4"
                    onClick={() => router.push("/auth/signin")}
                  >
                    Back to Login
                  </Button>,
                ]}
              />
            </>
          ) : (
            <>
              <h4 className="font-poppins flex flex-row  my-8 font-semibold  text-[24px] text-gray-800 mt-3">
                <BsStack className="w-10 h-10 text-[#0577fb] pr-2" /> Edustack
              </h4>

              <h5 className="font-poppins font-semibold pl-3 my-3 text-sm w-full text-left">
                Activate your Account
              </h5>

              <p className="font-poppins w-full text-left pl-2 text-[12px] text-gray-700 mt-3">
                College Mail
              </p>
              <Input
                placeholder="Enter your college email"
                value={enteredEmail}
                type="email"
                onChange={(e) => setEnteredEmail(e.target.value)}
                size="large"
                prefix={<HiOutlineMail />}
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
                prefix={<HiOutlineLockClosed />}
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
                prefix={<HiOutlineLockClosed />}
              />

              <Button
                onClick={handleFormSubmit}
                type="primary"
                className="w-full h-10 mt-6 mb-2 rounded-lg font-poppins"
                loading={submitButtonLoading}
              >
                Next
              </Button>

              <p className="font-poppins  text-[14px] text-gray-700 mt-3 mb-6">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-[#0577fb]">
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCreateAccount}
        centered
        title="Confirm Your Details"
        footer={[
          <Button
            key="back"
            onClick={() => setIsModalOpen(false)}
            className="rounded-lg"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleCreateAccount}
            loading={createAccountLoading}
            className="rounded-lg"
          >
            Create Account
          </Button>,
        ]}
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
                {facultyDetails.facultyDesignation}
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
