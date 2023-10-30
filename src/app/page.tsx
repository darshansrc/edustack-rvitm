'use client';
import React from 'react';
import styles from './HomePage.module.css';
import Link from 'next/link';

const HomePage = () => {
  return (
      <main>
            <div className={styles.pageContainer}>              
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                <img src='/logo.png' style={{ maxWidth: '60px', maxHeight: '60px', alignItems: 'center' }} />
                <h1 style={{ fontSize: '25px', padding: '10px' }}> | </h1>
                <img src='/logorv.png' style={{ maxWidth: '60px', maxHeight: '60px', alignItems: 'center' }} />
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 'bolder', margin: '20px', fontFamily: 'golos text', fontVariant: '600' }}>Welcome to EduStack for RVITM</h1>
              <p style={{ margin: '20px', color: 'grey', fontFamily: 'sans-serif', marginBottom: '15vh'}}>A Platform Built to Simplify Attendance Tracking & Academics </p>

              <div className={styles.buttonContainer}>
              <Link href='/auth/signin' style={{width: '95%'}}><button className={styles.primaryButton}>Sign In </button></Link>
              <button className={styles.secondaryButton}>Activate your Account</button>
            </div>
            </div>
      </main>
  );
}

export default HomePage;
