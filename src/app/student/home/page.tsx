

import getUser from '@/lib/getUser'

import React from 'react'
import SignOutButton from './SignOutButton';
import Navbar from '../components/navbar/Navbar';
import styles from '../components/navbar/Navbar.module.css'

async function App() {
  const user = await getUser()

  const formattedString = JSON.stringify(user, null, "\t");



  return (
    <>
    <Navbar/>
    <div className={styles.pageContainer}>
        Home
    </div>
    </>
  ) 
}

export default App