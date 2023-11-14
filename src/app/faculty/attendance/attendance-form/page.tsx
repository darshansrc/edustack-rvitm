'use client';
import React from 'react'
import AttendanceForm from './AttendanceForm';
import BottomNavbar from '../../components/bottomNavbar/BottomNavbar';
import DesktopNavbar from '../../components/DesktopNavBar/DesktopNavbar';
import { Layout } from 'antd';

const page = () => {
  return (
    <div className='flex flex-row'>
      <DesktopNavbar/>
    <Layout style={{width: '100%'}}>
    <AttendanceForm/>
    </Layout>
     

    </div>
  )
}

export default page