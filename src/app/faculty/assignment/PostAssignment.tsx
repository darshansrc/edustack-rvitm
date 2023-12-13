"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase-config";
import { collection, addDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Button, Input, Select, Upload, message, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const PostAssignment = () => {
  const storage = getStorage();
  const [classSubjectPairList, setClassSubjectPairList] = useState<any[]>([]);
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [assignmentTopic, setAssignmentTopic] = useState<string>("");
  const [assignmentDescription, setAssignmentDescription] =
    useState<string>("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const { Option } = Select;

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

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleUpload = async () => {
    try {
      setUploading(true);

      // Upload file to Firebase Storage
      const file = fileList[0].originFileObj;
      const storageRef = ref(storage, `assignments/${file.name}`);
      await uploadBytes(storageRef, file);

      // Get download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);

      // Save assignment details to Firestore under "assignments" subcollection
      const classDocRef = doc(db, "database", selectedClassName);
      const assignmentsCollectionRef = collection(classDocRef, "assignments");
      const assignmentData = {
        topic: assignmentTopic,
        description: assignmentDescription,
        fileURL: downloadURL,
      };
      await addDoc(assignmentsCollectionRef, assignmentData);

      message.success("Assignment posted successfully!");
    } catch (error) {
      console.error("Error uploading assignment:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center flex-col  justify-center w-full">
        <div className="flex flex-col items-center">
          <p className="text-left font-[Poppins] font-[500] text-[12px] mt-2 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
            Class
          </p>
          <Select
            value={selectedClassName || undefined}
            onChange={(value) => {
              setSelectedClassName(value);
              setSelectedSubject("");
            }}
            size="large"
            placeholder="Select Class"
            className="w-[85vw] max-w-[450px]"
          >
            {Object.keys(uniqueClassOptions).map((className, index) => (
              <Select.Option key={index} value={className}>
                {uniqueClassOptions[className][0].classSemester}SEM {className}
              </Select.Option>
            ))}
          </Select>

          <p className="text-left font-[Poppins] font-[500] text-[12px] mt-6 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
            Subject
          </p>
          <Select
            value={selectedSubject || undefined}
            onChange={(value) => setSelectedSubject(value)}
            placeholder="Select Subject"
            className="w-[85vw]  max-w-[450px]"
            size="large"
          >
            {uniqueClassOptions[selectedClassName]?.map((pair, index) => (
              <Select.Option key={index} value={pair.code}>
                {pair.subjectName} ({pair.code})
              </Select.Option>
            ))}
          </Select>

          <p className="text-left font-[Poppins] font-[500] text-[12px] mt-6 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
            Assignment Topic
          </p>
          <Input
            value={assignmentTopic}
            onChange={(e) => setAssignmentTopic(e.target.value)}
            placeholder="Enter assignment topic"
            className="w-[85vw] max-w-[450px] "
            size="large"
          />

          <p className="text-left font-[Poppins] font-[500] text-[12px] mt-6 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
            Assignment Description
          </p>
          <textarea
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
            placeholder="Enter assignment Description"
            className="mt-1 p-2 border rounded-md w-full focus:border-blue-200 border-1px"
          />

          <p className="text-left font-[Poppins] font-[500] text-[12px] mt-6 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
            Upload Assignment File
          </p>
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            className="w-[85vw] max-w-[450px]"
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <div className="w-full justify-end flex">
            <Button type="primary" onClick={handleUpload} className="mt-4">
              Post Assignment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAssignment;
