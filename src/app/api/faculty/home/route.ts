import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase-config";

customInitApp();

interface facultyDetails {
  facultyDesignation: string;
  facultyName: string;
  facultyDepartment: string;
}

export async function GET(request: NextRequest) {
  const session = cookies().get("session")?.value || "";

  let facultyDetails: facultyDetails = {
    facultyDesignation: "",
    facultyName: "",
    facultyDepartment: "",
  };

  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const decodedClaims = await auth().verifySessionCookie(session, true);

  if (!decodedClaims) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const userUID = decodedClaims.uid; // Get the user's UID

  if (decodedClaims.email) {
    const queryPath = "faculty";
    const facultyQuery = query(
      collection(db, queryPath),
      where("facultyEmail", "==", decodedClaims.email)
    );

    const facultySnapshot = await getDocs(facultyQuery);

    console.log(facultySnapshot.docs);

    await Promise.all(
      facultySnapshot.docs.map(async (facultyDoc) => {
        // Assuming "facultyDetails" is the field containing details in the document
        const data = facultyDoc.data() as facultyDetails;

        if (data) {
          facultyDetails = data;
          console.log(facultyDetails);
        }
      })
    );
  }

  return NextResponse.json(
    { isLogged: true, decodedClaims, userUID, facultyDetails },
    { status: 200 }
  );
}
