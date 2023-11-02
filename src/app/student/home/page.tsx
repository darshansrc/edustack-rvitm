

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
    <div className='mx-auto max-w-4xl my-32 ' >
      <h1 className='text-3xl mb-8'>You are now in student protected area of the app</h1>
      <p className='mb-4 font-light text-xl'>Here is your information:</p>
      <div className=" bg-gray-800 p-4 rounded-md shadow-md ">
        <pre  className="text-sm text-white font-mono" >
          <code >{formattedString}</code>
        </pre>

  
      </div>
    </div>

      <SignOutButton/>

    </div>
    </>
  ) 
}

export default App