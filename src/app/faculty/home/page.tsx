'use client'
import getUser from '@/lib/getUser'
import React from 'react'
import BottomNavbar from '../components/bottomNavbar/BottomNavbar';
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar';
import FacultyHomePage from './FacultyHomePage';
import DesktopNavbar from '../components/DesktopNavBar/DesktopNavbar';

async function App() {
  

  return (
    <>
      <TopNavbar name='EduStack' />
      <FacultyHomePage />
      <BottomNavbar />
      <DesktopNavbar />

    
    </>
  )
}

export default App