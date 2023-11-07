'use client';
import React from 'react'
import styles from './AssignmentPage.module.css'

const AssignmentPage = () => {
  return (
    <div className={styles.contentContainer}>
        <div className={styles.container}>
            <div className={styles.assignmentTable}>
                No assignments yet
            </div>
        </div>
    </div>
  )
}

export default AssignmentPage