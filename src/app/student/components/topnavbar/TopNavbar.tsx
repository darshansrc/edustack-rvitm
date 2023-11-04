import React from 'react'
import styles from './TopNavbar.module.css'
import {MdArrowBackIos} from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'

const TopNavbar = () => {
  return (
    <div className={styles.topNavbar}>
        <div style={{paddingLeft: '20px',fontSize: '18px'}}>
            <MdArrowBackIos/>
        </div>
        <div style={{ fontWeight: '500',fontFamily: 'Poppins',color: '#333',fontSize: '16px'}}>
            Attendance Dashboard
        </div>
        <div style={{paddingRight: '20px',fontSize: '18px'}}><BsThreeDotsVertical/></div>
    </div>
  )
}

export default TopNavbar