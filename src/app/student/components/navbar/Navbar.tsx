'use client';
import React from 'react'
import styles from './Navbar.module.css'
import { RiBookMarkLine } from "react-icons/ri";
import { BiHome } from "react-icons/bi";
import { TbReport } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { BsPersonCheck } from "react-icons/bs";
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {

  const pathname = usePathname()



  return (
    <nav className={styles.navBar}>
        <div className={styles.navLogo}>
            <Image src='/logo.png' alt='logo' height={30} width={30}/>
            <h2 style={{fontWeight: '600', fontFamily: 'Poppins', fontSize: '20px',marginLeft: '5px'}}>EduStack</h2>
        </div>


        <Link href={'/student/home'}>
        <div className={pathname.endsWith("/home") ? styles.navItemActive : styles.navItem}>
        <i><BiHome style={{ fontSize: "20px" }} /></i>
        <div style={{fontFamily: 'Poppins'}}>Home</div>
        </div>
        </Link>
    
        <Link href='/student/attendance'>
        <div className={pathname.endsWith("/attendance") ? styles.navItemActive : styles.navItem}>
        <i><BsPersonCheck style={{ fontSize: "20px" }} /></i>
        <div style={{fontFamily: 'Poppins'}}>Attendance</div>
        </div>
        </Link>

        <Link href='/student/course'>
        <div className={pathname.endsWith("/course") ? styles.navItemActive : styles.navItem}>
        <i><TbReport style={{ fontSize: "20px" }} /></i> 
        <div style={{fontFamily: 'Poppins'}}>Course</div>
        </div>
        </Link>

        <Link href={'/student/profile'}>
        <div className={pathname.endsWith("/profile") ? styles.navItemActive : styles.navItem}>
        <i><CgProfile style={{ fontSize: "20px" }} /></i>
        <div style={{fontFamily: 'Poppins'}}>Profile</div>
        </div>
        </Link>

 
    </nav>
  )
}

export default Navbar