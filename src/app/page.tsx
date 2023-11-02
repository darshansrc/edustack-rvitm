'use client';
import React from 'react';
import styles from './HomePage.module.css';
import Link from 'next/link';
import Image from 'next/image';

const HomePage = () => {
  return (
      <main>
            <div className={styles.pageContainer}>              
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                <Image priority  width={60} height={60} src='/logo.png' style={{ maxWidth: '60px', maxHeight: '60px', alignItems: 'center' }} alt={''}/>
                <h1 style={{ fontSize: '25px', padding: '10px' }}> | </h1>
                <Image priority width={60} height={60} src='/logorv.png' style={{ maxWidth: '60px', maxHeight: '60px', alignItems: 'center' }} alt={''} />
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 'bolder', margin: '20px', fontFamily: 'golos text', fontVariant: '600' }}>Welcome to EduStack for RVITM</h1>
              <p style={{ margin: '20px', color: 'grey', fontFamily: 'sans-serif', marginBottom: '15vh'}}>A Platform Built to Simplify Attendance Tracking & Academics </p>

              <div className={styles.buttonContainer}>
              <Link href='/auth/signin' shallow={true} style={{width: '95%'}}><button className={styles.primaryButton}>Sign In </button></Link>
              <button className={styles.secondaryButton}>Activate your Account</button>
            </div>
            </div>
      </main>
  );
}

export default HomePage;
