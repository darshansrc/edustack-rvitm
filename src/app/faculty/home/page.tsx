import getUser from '@/lib/getUser'
import React from 'react'
import BottomNavbar from '../components/bottomNavbar/BottomNavbar';
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar';
import FacultyHomePage from './FacultyHomePage';

async function App() {
  const user = await getUser()

  const formattedString = JSON.stringify(user, null, "\t");

  return (
    <>
      <TopNavbar name='EduStack' />
      <FacultyHomePage />
      <BottomNavbar />

    
    </>
  )
}

export default App