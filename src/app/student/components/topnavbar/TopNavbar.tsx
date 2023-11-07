'use client';
import React, { useEffect, useState } from 'react'
import styles from './TopNavbar.module.css'
import Image from 'next/image'

import { Cross } from './hamburger-react';
import { Box, Skeleton,  } from '@mui/material';

import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';

import { FiSun } from 'react-icons/fi';
import { HiSelector } from 'react-icons/hi';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase-config';
import Link from 'next/link';
import { ModalDialog } from '@mui/joy';


const TopNavbar = ({name}) => {

  const router = useRouter();

  const [isOpen, setOpen] = useState(false)
  const [userUID, setUserUID] = useState(null)
  const [userType, setUserType] = useState(null)
  const[userEmail, setUserEmail] = useState(null)

  const [logoutModalopen, setLogoutModalOpen] = useState(false);

  const handleOpen = () => setLogoutModalOpen(true);
  const handleClose = () => setLogoutModalOpen(false);


  const handleSignOut = async () => {
    document.cookie = 'studentData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'photoUrl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    signOut(auth);
    const response = await fetch(`${window.location.origin}/api/signout`, {
      method: "POST",
    });
    if (response.status === 200) {
      router.push("/");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const responseAPI = await fetch(`${window.location.origin}/api/auth`, {});

      if (responseAPI.status === 200) {
        const responseBody = await responseAPI.json();
        setUserUID(responseBody.userUID);
        setUserType(responseBody.userType);
        setUserEmail(responseBody.userEmail);
      }
    };

    fetchData();
  }, []);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  
  return (
    <div className={styles.container}>
    <div className={styles.topNavbar}>
        <div style={{paddingLeft: '20px',fontSize: '18px',display: 'flex',flexDirection: 'row',alignItems: 'center', paddingRight: '20px',}}>
        <img  width={35} height={35} src='/logo.png' alt={''} style={{paddingRight: '10px'}}/>
        <div style={{ fontWeight: '500',fontFamily: 'Poppins',color: '#333',fontSize: '16px', borderLeft: '1px solid #00000014', paddingLeft: '10px'}}>
            {name}
        </div>
        </div>

        <div style={{ borderRadius: '50%',marginRight: '30px' ,maxWidth: '30px',maxHeight: '30px', border: '0.5px solid #00000025',position: 'relative'}}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            border: '0.5px solid #00000025',
            borderRadius: '50%',
            padding: '6px',

          }}>
          <Cross rounded toggled={isOpen} toggle={setOpen} size={16} />
          </div>
        </div>
    </div>
    {isOpen && <div className={styles.openNavbar}>

      
      <div className={styles.openNavbarContainer}>


      <Link href='/student/home'>
      <div className={styles.openNavbarItem} >
        Home
      </div>
      </Link>
      <div className={styles.openNavbarItem}>
        <div className={styles.themeSelector}>
        <div className={styles.themeSelectorTitle}>
            Theme
          </div>
          <div className={styles.themeSelectorButton}>
          <FiSun/> <p style={{paddingLeft: '5px',fontFamily: 'Poppins', paddingRight: '10px'}}>Light</p> <HiSelector/>

          </div>
        </div>
      </div>

      <div className={styles.openNavbarItem}>
        Report Bug
      </div>
      <div className={styles.openNavbarItem}>
        About EduStack
      </div>

      <Link href={'/student/profile'} shallow={true}>
      <div className={styles.openNavbarButton} style={{marginTop: '40px',color: 'rgb(29 78 216)'}}>
        
        {userEmail ? userEmail : <Skeleton variant="text" width={100} height={20} animation="wave" />}
      </div>
      </Link>
      

      <div className={styles.openNavbarButton} onClick={handleOpen} style={{color: 'rgb(244, 41, 41)'}}>
        Log Out
      </div>

      </div>
      
      </div>}

      <Modal
        open={logoutModalopen}
        onClose={handleClose}
      >
  <ModalDialog>

  <h2 style={{
      textAlign: 'center',
      fontFamily: 'Poppins',
      fontWeight: '500',
      color: '#333',
      fontSize: '18px',
      paddingBottom: '0px',

    }}>Confirm Logout?</h2>

    <h2 style={{
      textAlign: 'center',
      fontFamily: 'Poppins',
      fontWeight: '400',
      color: '#333',
      fontSize: '12px',
      paddingBottom: '20px',
    }}>You will be returned to the login screen.</h2>

      <div className={styles.openNavbarButton} onClick={() => handleSignOut()} style={{color: 'rgb(244, 41, 41)',margin: '0',padding: '10px'}}>
        Log Out
      </div>
      <div className={styles.openNavbarButton} onClick={handleClose} style={{color: 'rgb(29 78 216)', margin: '0', padding: '10px'}}>
        Cancel
      </div>
  </ModalDialog>

      </Modal>


    </div>
  )
}

export default TopNavbar