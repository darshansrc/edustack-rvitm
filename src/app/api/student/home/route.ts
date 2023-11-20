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

  const userUID = decodedClaims.uid; // Get the user's UID
  const getRef = doc(db, "users", userUID);
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
    userUID: string;
  } = {
    studentName: "",
    studentEmail: "",
    studentID: "",
    studentUSN: "",
    studentLabBatch: "",
    classSemester: "",
    className: "",
    userUID: "",
  };

  if (userDoc.exists()) {
    const userData = userDoc.data();
    userType = userData.type;
  }

  if (decodedClaims && decodedClaims.email) {
    const queryPath = "students";
    const collectionGroupRef = collectionGroup(db, queryPath);
    const studentQuery = query(
      collectionGroupRef,
      where("email", "==", decodedClaims.email)
    );
    const studentSnapshot = await getDocs(studentQuery);

    await Promise.all(
      studentSnapshot.docs.map(async (studentDoc) => {
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
            userUID,
          };
        }
      })
    );
  }

  return NextResponse.json(
    { isLogged: true, decodedClaims, userUID, userType, studentDetails },
    { status: 200 }
  );
}
