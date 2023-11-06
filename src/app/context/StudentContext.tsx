'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StudentContextType {
  studentDetails: any; // Update this type according to your data structure
  classSemester: string;
  classId: any; // Update this type according to your data structure
  dataFetched: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [classSemester, setClassSemester] = useState<string>('');
  const [classId, setClassId] = useState<any>(null);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAttendanceData() {
      try {
        const currentServerDomain = window.location.origin;
        const responseAPI = await fetch(`${currentServerDomain}/api/student/attendance`, {
          method: 'GET',
        });
        if (responseAPI.status === 200) {
          const responseBody = await responseAPI.json();
          setStudentDetails(responseBody.studentDetails);        
          setClassId(responseBody.studentDetails.className);
          setClassSemester(responseBody.studentDetails.classSemester);
          setDataFetched(true);

         
        } else {
          console.log('Cannot fetch data');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }

    fetchAttendanceData();
  }, []);

  return (
    <StudentContext.Provider value={{ studentDetails, classSemester, classId, dataFetched }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};
