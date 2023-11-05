import React from 'react'
import styles from './TopNavbar.module.css'
import {MdArrowBackIos} from 'react-icons/md'
import { IoReorderTwoOutline } from 'react-icons/io5'
import Image from 'next/image'

const TopNavbar = ({name}) => {
  return (
    <div className={styles.container}>
    <div className={styles.topNavbar}>
        <div style={{paddingLeft: '20px',fontSize: '18px',display: 'flex',flexDirection: 'row',alignItems: 'center', paddingRight: '20px',}}>
        <Image priority width={35} height={35} src='/logo.png' alt={''} style={{paddingRight: '10px'}}/>
        <div style={{ fontWeight: '500',fontFamily: 'Poppins',color: '#333',fontSize: '16px', borderLeft: '1px solid #00000014', paddingLeft: '10px'}}>
            {name}
        </div>
        </div>

        <div style={{fontSize: '22px', borderRadius: '50%',marginRight: '20px', border: '0.5px solid #00000025',padding: '3px'}}><IoReorderTwoOutline/></div>
    </div>
    </div>
  )
}

export default TopNavbar