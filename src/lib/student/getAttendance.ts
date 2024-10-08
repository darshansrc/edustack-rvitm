import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import getUser from "@/lib/getUser";


export async function getAttendance() {

    let userType : string = '';
    let studentDetails: {
        studentName: string;
        studentEmail: string;
        studentID: string;
        studentUSN: string;
        studentLabBatch: string;
        classSemester: string;
        className: string;
      } = {
        studentName: '',
        studentEmail: '',
        studentID: '',
        studentUSN: '',
        studentLabBatch: '',
        classSemester: '',
        className: '',
      }
    let subjectOptions: { value: string; label: string; subjectType: string , subjectSemester: number}[] = [];
    let attendanceDocs;
    
    


    const  user = await getUser();
 
    
  
   


    if(user?.uid){
        const getRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(getRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            userType = userData.type;
      
      
      
      
            
          }
        
          if (user && user.email) {
            
              const queryPath = 'students';
              const collectionGroupRef = collectionGroup(db, queryPath);
              const studentQuery = query(collectionGroupRef, where('email', '==', user.email));
              const studentSnapshot = await getDocs(studentQuery);
      
              await Promise.all(
                studentSnapshot.docs.map(async (studentDoc) => {
                  const className = studentDoc.ref.parent.parent?.id || '';
                  const studentID = studentDoc.ref.id;
                  const classDocRef = doc(db, 'database', className);
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
                    };
      
      
                    if (className) {
                      const classDocRef = doc(db, 'database', className);
                      const classDocSnapshot = await getDoc(classDocRef);
        
                      if (classDocSnapshot.exists()) {
                        const subjectsCollectionRef = collection(classDocRef, 'subjects'); // Assuming 'subjects' is the subcollection name
                        const subjectDocsSnapshot = await getDocs(subjectsCollectionRef);
        
                        subjectDocsSnapshot.docs.forEach((doc) => {
                          const data = doc.data();
        
                          // Check if the subject is compulsory or elective and if it's elective, check if the user's USN is in the electiveStudents array
                          const isElective = data.compulsoryElective === 'elective';
                          const isUserInElective = isElective && data.electiveStudents.includes(studentDetails.studentUSN);
        
                          // Include the subject only if it's compulsory or if it's elective and the user is in the electiveStudents array
                          if (data.compulsoryElective === 'compulsory' || isUserInElective) {
                              subjectOptions.push({ value: data.code, label: data.name, subjectType: data.theoryLab, subjectSemester: data.semester });
                            
                          }
      
                        });
                      }
                    }
      
      
                    try {
                      if (subjectOptions && classSemester && className) {
                        const subjectValues = subjectOptions.map((option) => option.value);
                        const attendanceRefs = subjectValues.map((subject) =>
                          collection(db, 'database', className, 'attendance', '' + classSemester + 'SEM', subject)
                        );
                        const attendanceSnapshots = await Promise.all(attendanceRefs.map((ref) => getDocs(ref)));
                
                        // Check if any attendance data is null or undefined
                        if (attendanceSnapshots.some((snapshot) => !snapshot || !snapshot.docs)) {
                          console.error('Error: Firestore query returned null or undefined data.');
                          return;
                        }
                
                        attendanceDocs = attendanceSnapshots.map((snapshot) => snapshot.docs.map((doc) => doc.data()));
      
                      }
                    } catch (error) {
                      console.error('Error fetching attendance data from Firestore', error);
                    }
      
      
                  }
                })
              );
      
          }
    }



  return (
    { studentDetails, attendanceDocs, subjectOptions }
  );
}
