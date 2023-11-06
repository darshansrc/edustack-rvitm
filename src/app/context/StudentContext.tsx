'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StudentDetails {
  studentName: string;
  studentUSN: string;
  className: string;
  // Add more fields as needed
}

interface StudentContextType {
  studentDetails: StudentDetails | null;
  setStudentDetails: (studentDetails: StudentDetails | null) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentContextProvider({ children }: { children: ReactNode }) {
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);

  return (
    <StudentContext.Provider value={{ studentDetails, setStudentDetails }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudentContext must be used within a StudentContextProvider');
  }
  return context;
}
