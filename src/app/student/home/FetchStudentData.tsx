import {  db } from '@/lib/firebase-config';
import getUser from '@/lib/getUser';
import { collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import StudentHomePage from './StudentHomePage';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';



const FetchStudentData = async () => {

  const storage = getStorage();

  type user = {
    uid: string;
    email?: string;
    picture?: string;
  }

  const user : user | null = await getUser();

  interface StudentDetails  {
    studentName: string;
    studentUSN: string;
    className: string;

  };
  

  let FetchedStudentDetails : StudentDetails = {
    studentName: '',
    studentUSN: '',
    className: '',

  };

  

  const dataFetched = true;
  if (user) {

    console.log(user)
      
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

          // getDownloadURL(ref(storage, `photos/${studentUSN}.jpg`))
          // .then((url) => {
          //     const photoUrl = url
          // })
          // .catch((error) => {
          //   console.log(error)
          // });

          FetchedStudentDetails   = {
            studentName,
            studentUSN,
            className,

          }



        }
      })
    );

}

      



  
  return (
    <StudentHomePage studentDetails={FetchedStudentDetails} />

  )
}

export default FetchStudentData;