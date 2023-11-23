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
    const getRef = doc(db, "faculty", decodedClaims.email);
    const userDoc = await getDoc(getRef);
    facultyDetails = userDoc.data() as facultyDetails;
  }

  return NextResponse.json(
    { isLogged: true, decodedClaims, userUID, facultyDetails },
    { status: 200 }
  );
}
