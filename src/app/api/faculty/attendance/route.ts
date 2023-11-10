import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from "firebase/firestore";
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
    const getRef = doc(db, 'users', userUID);
    const userDoc = await getDoc(getRef);
  
    let userType : string = '';

    let facultyDetails: {
        facultyName: string;
        facultyEmail: string;
        facultyBranch: string;
        facultyType: string;
        userUID: string;
      } = {
        facultyName: '',
        facultyEmail: '',
        facultyBranch: '',
        facultyType: '',
        userUID: ''
      }

      const classSubjectPairsList: any[] = [];


  
    if (userDoc.exists()) {
      const userData = userDoc.data();
      userType = userData.type;
    }
  
    if (decodedClaims && decodedClaims.email) {
        const queryPath = 'subjects'; 
        const collectionGroupRef = collectionGroup(db, queryPath);
        const facultiesQuery = query(collectionGroupRef, where('faculties', 'array-contains', decodedClaims.email));
    
        const facultiesSnapshot = await getDocs(facultiesQuery);
        
    
        await Promise.all(facultiesSnapshot.docs.map(async (facultyDoc) => {
          // Perform a null check before accessing parent.parent
          if (facultyDoc.ref.parent && facultyDoc.ref.parent.parent) {
            const className = facultyDoc.ref.parent.parent.id;
            const classDocRef = doc(db, 'database', className); // Update with your class collection name
            const classDocSnapshot = await getDoc(classDocRef);
    
            if (classDocSnapshot.exists()) {
              const classData = classDocSnapshot.data();
              const classSemester = classDocSnapshot.data().currentSemester.toString();
              const code = facultyDoc.data().code;
              const subjectName = facultyDoc.data().name;
              const subjectType = facultyDoc.data().theoryLab;
              const subSemester = facultyDoc.data().semester.toString();
              console.log(classSemester, subSemester);
    
              if (subSemester === classSemester) {
                console.log("yes");
                classSubjectPairsList.push({ className, code, subjectName, subjectType, subSemester, classSemester, ...classData });
              }
            }
          }
        }));
    
        console.log(classSubjectPairsList);
    

}


  return NextResponse.json({ isLogged: true,decodedClaims, userUID , userType, classSubjectPairsList }, { status: 200 });
}
