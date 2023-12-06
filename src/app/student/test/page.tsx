"use client";
// pages/index.tsx

import { useState, useEffect } from "react";
import { Button, Card, Modal, Input, InputNumber, Table, message } from "antd";
import {
  Firestore,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase-config";

const Home: React.FC = () => {
  const [currentCGPA, setCurrentCGPA] = useState<number>(0);
  const [semesters, setSemesters] = useState<Array<number>>([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    // Fetch semesters or any other initialization logic
  }, []);

  const fetchSubjects = async (semester: number) => {
    const subjectsQuery = collection(db, `CGPA/${semester}/subjects`);
    const subjectsSnapshot = await getDocs(subjectsQuery);
    const subjectsData = subjectsSnapshot.docs.map((doc) => ({
      key: doc.id,
      ...doc.data(),
    }));
    setSubjects(subjectsData);
  };

  const handleEditClick = (semester: number) => {
    setSelectedSemester(semester);
    setModalVisible(true);
    fetchSubjects(semester);
  };

  const SubjectTable: React.FC<{
    subjects: any[];
    onRemoveSubject: (key: number) => void;
  }> = ({ subjects, onRemoveSubject }) => {
    const columns = [
      {
        title: "Subject Name",
        dataIndex: "subjectName",
        key: "subjectName",
        render: (text: string, record: any) => (
          <Input
            value={text}
            onChange={(e) => {
              const updatedSubjects = [...subjects];
              updatedSubjects[record.key].subjectName = e.target.value;
              setSubjects(updatedSubjects);
            }}
          />
        ),
      },
      {
        title: "Credits",
        dataIndex: "credits",
        key: "credits",
        render: (text: number, record: any) => (
          <InputNumber
            value={text}
            onChange={(value) => {
              const updatedSubjects = [...subjects];
              updatedSubjects[record.key].credits = value;
              setSubjects(updatedSubjects);
            }}
          />
        ),
      },
      {
        title: "Marks Scored",
        dataIndex: "marks",
        key: "marks",
        render: (text: number, record: any) => (
          <InputNumber
            value={text}
            onChange={(value) => {
              const updatedSubjects = [...subjects];
              updatedSubjects[record.key].marks = value;
              setSubjects(updatedSubjects);
            }}
          />
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (text: string, record: any) => (
          <span>
            <Button type="text" onClick={() => onRemoveSubject(record.key)}>
              Remove
            </Button>
          </span>
        ),
      },
    ];

    return <Table dataSource={subjects} columns={columns} pagination={false} />;
  };

  const handleAddSubject = () => {
    setSubjects((prevSubjects) => [
      ...prevSubjects,
      { key: prevSubjects.length, subjectName: "", credits: 0, marks: 0 },
    ]);
  };

  const handleRemoveSubject = async (key: number) => {
    const subjectId = subjects[key]?.key;

    if (subjectId) {
      // Remove the subject from Firebase
      await deleteDoc(
        doc(db, `CGPA/${selectedSemester}/subjects/${subjectId}`)
      );

      // Update the local state by filtering out the removed subject
      setSubjects((prevSubjects) =>
        prevSubjects.filter((subject) => subject.key !== subjectId)
      );

      message.success("Subject removed successfully");
    }
  };

  const handleSave = async () => {
    try {
      // Update the subject data in Firebase
      await Promise.all(
        subjects.map(async (subject) => {
          if (subject.key) {
            // Existing subject, update in Firebase
            await setDoc(
              doc(db, `CGPA/${selectedSemester}/subjects`, subject.key),
              subject
            );
          } else {
            // New subject, add to Firebase
            const subjectDocRef = await addDoc(
              collection(db, `CGPA/${selectedSemester}/subjects`),
              subject
            );
            console.log("Subject document written with ID: ", subjectDocRef.id);
          }
        })
      );

      // TODO: Update CGPA and SGPA logic here

      // Show success message
      message.success("Data updated successfully");

      setModalVisible(false);
    } catch (e) {
      console.error("Error updating data: ", e);

      // Show error message
      message.error("Error updating data");
    }
  };

  return (
    <div>
      <h1>Current CGPA: {currentCGPA.toFixed(2)}</h1>
      <div className="grid grid-cols-4 gap-4">
        {semesters.map((sgpa, index) => (
          <Card
            key={index}
            title={`Semester ${index + 1}`}
            extra={
              <Button type="text" onClick={() => handleEditClick(index)}>
                Edit
              </Button>
            }
          >
            <p>SGPA: {sgpa.toFixed(2)}</p>
          </Card>
        ))}
      </div>

      <Modal
        title={`Edit Semester ${
          selectedSemester !== null ? selectedSemester + 1 : ""
        }`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <SubjectTable
          subjects={subjects}
          onRemoveSubject={handleRemoveSubject}
        />
        <Button
          type="dashed"
          onClick={handleAddSubject}
          style={{ margin: "8px 0" }}
        >
          Add Subject
        </Button>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal>
    </div>
  );
};

export default Home;
