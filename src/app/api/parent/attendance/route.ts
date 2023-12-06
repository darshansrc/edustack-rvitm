import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase-config";

customInitApp();

export async function GET(request: NextRequest) {
  const session = cookies().get("session")?.value || "";

  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const decodedClaims = await auth().verifySessionCookie(session, true);

  if (!decodedClaims) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const uid = decodedClaims.uid; // Get the user's UID
  const getRef = doc(db, "users", uid);
  const userDoc = await getDoc(getRef);

  let userType: string = "";
  let studentDetails: {
    studentName: string;
    studentEmail: string;
    studentID: string;
    studentUSN: string;
    studentLabBatch: string;
    classSemester: string;
    className: string;
    uid: string;
  } = {
    studentName: "",
    studentEmail: "",
    studentID: "",
    studentUSN: "",
    studentLabBatch: "",
    classSemester: "",
    className: "",
    uid: "",
  };

  let subjectOptions: {
    value: string;
    label: string;
    subjectType: string;
    subjectSemester: number;
    faculties: string[];
  }[] = [];
  let attendanceDocs: any[] = []; // Replace 'any' with the actual type of your attendance data

  if (userDoc.exists()) {
    const userData = userDoc.data();
    userType = userData.type;
  }

  if (decodedClaims && decodedClaims.email) {
    const queryPath = "students";
    const collectionGroupRef = collectionGroup(db, queryPath);
    const studentQuery = query(
      collectionGroupRef,
      where("fatherEmail", "==", decodedClaims.email)
    );
    const studentFatherSnapshot = await getDocs(studentQuery);

    const studentMotherQuery = query(
      collectionGroupRef,
      where("motherEmail", "==", decodedClaims.email)
    );
    const studentMotherSnapshot = await getDocs(studentMotherQuery);

    let studentSnapshot = studentFatherSnapshot.docs.concat(
      studentMotherSnapshot.docs
    );

    await Promise.all(
      studentSnapshot.map(async (studentDoc) => {
        const className = studentDoc.ref.parent.parent?.id || "";
        const studentID = studentDoc.ref.id;
        const classDocRef = doc(db, "database", className);
        const classDocSnapshot = await getDoc(classDocRef);

        if (classDocSnapshot.exists()) {
          const classSemester = classDocSnapshot.data().currentSemester;
          const studentLabBatch = studentDoc.data().labBatch;
          const studentName = studentDoc.data().name;
          const studentUSN = studentDoc.data().usn;
          const studentEmail = studentDoc.data().email;
          studentDetails = {
            studentName,
            studentEmail,
            studentID,
            studentUSN,
            studentLabBatch,
            classSemester,
            className,
            uid: uid,
          };

          if (className) {
            const classDocRef = doc(db, "database", className);
            const classDocSnapshot = await getDoc(classDocRef);

            if (classDocSnapshot.exists()) {
              const subjectsCollectionRef = collection(classDocRef, "subjects"); // Assuming 'subjects' is the subcollection name
              const subjectDocsSnapshot = await getDocs(subjectsCollectionRef);

              await Promise.all(
                subjectDocsSnapshot.docs.map(async (doc) => {
                  const data = doc.data();

                  // Check if the subject is compulsory or elective and if it's elective, check if the user's USN is in the electiveStudents array
                  const isElective = data.compulsoryElective === "elective";
                  const isUserInElective =
                    isElective &&
                    data.electiveStudents.includes(studentDetails.studentUSN);

                  // Include the subject only if it's compulsory or if it's elective and the user is in the electiveStudents array
                  if (
                    data.compulsoryElective === "compulsory" ||
                    isUserInElective
                  ) {
                    const subjectValue = data.code;
                    const subjectLabel = data.name;
                    const subjectType = data.theoryLab;
                    const subjectSemester = data.semester;
                    const faculties = data.faculties;

                    // Store subject options separately
                    subjectOptions.push({
                      value: subjectValue,
                      label: subjectLabel,
                      subjectType,
                      subjectSemester,
                      faculties,
                    });

                    try {
                      if (subjectOptions && classSemester && className) {
                        const attendanceRef = collection(
                          db,
                          "database",
                          className,
                          "attendance",
                          "" + classSemester + "SEM",
                          subjectValue
                        );
                        const attendanceSnapshot = await getDocs(attendanceRef);

                        // Check if attendance data is null or undefined
                        if (!attendanceSnapshot || !attendanceSnapshot.docs) {
                          console.error(
                            "Error: Firestore query returned null or undefined data."
                          );
                          return;
                        }

                        const attendanceData = attendanceSnapshot.docs.map(
                          (doc) => doc.data()
                        );

                        // Store attendance data separately
                        attendanceDocs.push(attendanceData);
                      }
                    } catch (error) {
                      console.error(
                        "Error fetching attendance data from Firestore",
                        error
                      );
                    }
                  }
                })
              );
            }
          }
        }
      })
    );
  }

  return NextResponse.json(
    {
      isLogged: true,
      uid,
      userType,
      studentDetails,
      subjectOptions,
      attendanceDocs,
    },
    { status: 200 }
  );
}
