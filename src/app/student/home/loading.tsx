import React from 'react'
import styles from './StudentHomePage.module.css'
import { Skeleton } from '@mui/material'

const Loading = () => {
  return (
    <div className={styles.welcomeCard}>
      <div style={{marginRight: '14px'}}>
          <Skeleton variant="circular" width={60} height={60} /> 
      </div>

      <div>
        <div className={styles.studentName}><Skeleton variant="text" sx={{ fontSize: '1.4rem',width: 100 }} /></div>
        <div className={styles.studentDetail}><Skeleton variant="text" sx={{ fontSize: '1rem',width: 80 }} /></div>
      </div>

    </div> 
  )
}

export default Loading