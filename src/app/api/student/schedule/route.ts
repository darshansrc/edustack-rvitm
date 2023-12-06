import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
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

  if (decodedClaims && decodedClaims.email) {
    const queryPath = "classSchedule";
    const collectionGroupRef = collectionGroup(db, queryPath);
    const facultiesQuery = query(
      collectionGroupRef,
      where("faculty", "==", decodedClaims.email)
    );

    const facultiesSnapshot = await getDocs(facultiesQuery);

    let queryResult: any[] = [];

    await Promise.all(
      facultiesSnapshot.docs.map(async (facultyDoc) => {
        // Push each document's data into the queryResult array
        queryResult.push(facultyDoc.data());
      })
    );

    // Return the queryResult array
    return NextResponse.json({ queryResult }, { status: 200 });
  }
}
