'use client';

import React from 'react'
import BottomNavbar from '../components/bottomNavbar/BottomNavbar';
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar';
import FacultyHomePage from './FacultyHomePage';

async function App() {



  return (
    <>
      <TopNavbar name='EduStack' />
      <FacultyHomePage />
      <BottomNavbar />

    
    </>
  )
}

export default App