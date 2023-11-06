'use client';
import React, { useEffect, useState } from 'react'
import styles from './TopNavbar.module.css'
import Image from 'next/image'

import { Cross } from './hamburger-react';
import { Skeleton } from '@mui/material';
import { FiSun } from 'react-icons/fi';
import { HiSelector } from 'react-icons/hi';

const TopNavbar = ({name}) => {

  const [isOpen, setOpen] = useState(false)
  const [userUID, setUserUID] = useState(null)
  const [userType, setUserType] = useState(null)
  const[userEmail, setUserEmail] = useState(null)

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
            zIndex: 100000

          }}>
          <Cross rounded toggled={isOpen} toggle={setOpen} size={16} />
          </div>
        </div>
    </div>
    {isOpen && <div className={styles.openNavbar}>
    <div className={styles.openTopNavbar}>
        <div style={{paddingLeft: '20px',fontSize: '18px',display: 'flex',flexDirection: 'row',alignItems: 'center', paddingRight: '20px',}}>
        <img  width={35} height={35} src='/logo.png' alt={''} style={{paddingRight: '10px'}}/>
        <div style={{ fontWeight: '500',fontFamily: 'Poppins',color: '#333',fontSize: '16px', borderLeft: '1px solid #00000014', paddingLeft: '10px'}}>
            {name}
        </div>
        </div>


       
    </div>
      
      <div className={styles.openNavbarContainer}>

      <div className={styles.openNavbarButton}>
        {userEmail ? userEmail : <Skeleton variant="text" width={100} height={20} animation="wave" />}
      </div>

      <div className={styles.openNavbarItem}>
        Home
      </div>
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
        Log Out
      </div>
      <div className={styles.openNavbarItem}>
        Report Bug
      </div>
      <div className={styles.openNavbarItem}>
        About EduStack
      </div>
      </div>
      
      </div>}
    </div>
  )
}

export default TopNavbar