import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { collection, collectionGroup, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase-config";

customInitApp();

export async function POST(request: NextRequest) {

    const res = await request.json();
    console.log(res +'res');

    
    const  classId  = res;

    console.log(classId+'classID <=')

    let StudentData: any[] = [];

    console.log('here nig')
  
    if (classId) {
        console.log('here')
      const studentsCollectionRef = collection(db, 'database', classId, 'students');
      const querySnapshot = await getDocs(studentsCollectionRef);

     
      querySnapshot.forEach((doc) => {
        const student = doc.data();
        console.log(student);
        const { name, usn, labBatch } = student;
        StudentData.push({ name, usn, labBatch });
      });



      console.log(StudentData)
    }

    return NextResponse.json({ StudentData }, { status: 200 });
  };
    
       
    




// export async function GET(request: NextRequest, response: NextResponse) {
//   const res = await request.json();
//   console.log(res);


//   await setDoc(doc(
//     db,
//     'database',
//     res.selectedClassName,
//     'classSchedule',
//     res.date+'-'+res.startTime+'-'+res.endTime
//   ),res)
  


//   return NextResponse.json({}, { status: 200 });



// }
