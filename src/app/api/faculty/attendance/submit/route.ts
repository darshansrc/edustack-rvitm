import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { collection, collectionGroup, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase-config";

customInitApp();

interface AttendanceFormData {
    classId: string;
    subjectCode: string;
    subjectSemester: string;
    classDate: string;
    classStartTime: string;
    classEndTime: string;
    students: {
      studentName: string;
      studentUSN: string;
      isPresent: boolean;
    }[];
    presentCount: number;
    absentCount: number;
    recordedTime: string;
    updatedTime: string;
    recordedByEmail: string;
    recordedByName: string;
    classTopic: string;
    classDescription: string;
  }

export async function POST(request: NextRequest, response: NextResponse) {
    try {
      const AttendanceFormData = await request.json();
  


      await setDoc(
        doc(db,
             'database', 
             AttendanceFormData.classId, 
             'attendance',
             AttendanceFormData.subjectSemester + "SEM",
             AttendanceFormData.subjectCode,
             AttendanceFormData.classStartTime+'-'+AttendanceFormData.classEndTime),
             AttendanceFormData
      );
  
      return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
      
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

    
       

