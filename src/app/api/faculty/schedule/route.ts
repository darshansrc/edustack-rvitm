import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
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
        const queryPath = 'classSchedule';
        const collectionGroupRef = collectionGroup(db, queryPath);
        const facultiesQuery = query(collectionGroupRef, where('faculty', "==", decodedClaims.email));
    
        const facultiesSnapshot = await getDocs(facultiesQuery);
    
        let queryResult: any[] = [];
    
        await Promise.all(facultiesSnapshot.docs.map(async (facultyDoc) => {
            // Push each document's data into the queryResult array
            queryResult.push(facultyDoc.data());
        }));
    
        // Return the queryResult array
        return NextResponse.json({ queryResult }, { status: 200 });
    }
}




export async function POST(request: NextRequest, response: NextResponse) {
    try {
      const requestBody = await request.json();
  
      // Check if the request body contains a flag for deletion
      if (requestBody.deleteSession) {
        // Delete the document using the specified parameters
        console.log('deleting...');
        console.log(requestBody.date)
        await deleteDoc(doc(db, 'database', requestBody.selectedClassName, 'classSchedule', requestBody.date));

        console.log('deleted')
        
        return NextResponse.json({ message: 'Session deleted successfully' }, { status: 200 });
      }
  
      else if (!requestBody.deleteSession) {
      await setDoc(
        doc(db, 'database', requestBody.selectedClassName, 'classSchedule', requestBody.startTime),
        requestBody
      );
  
      return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
