'use client';
import React, { useEffect, useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { BiHomeAlt } from 'react-icons/bi';
import { BsPeople, BsStack } from 'react-icons/bs';
import { RiStackFill, RiStackLine } from 'react-icons/ri';
import { PiStackFill } from "react-icons/pi";
import { RxCalendar } from 'react-icons/rx';
import { TbReport } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';
import { MdLogout } from 'react-icons/md';
import { usePathname } from 'next/navigation';

const { Sider } = Layout;

type MenuItem = {
  key: React.Key;
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: MenuItem[];
  link?: string;
};

const items: MenuItem[] = [
  {
    key: '1',
    icon: <BiHomeAlt />,
    label: 'Home',
    link: '/faculty/home',
  },
  {
    key: 'sub1',
    icon: <BsPeople />,
    label: 'Attendance',
    children: [
      {
        key: '3',
        label: 'View Attendance',
        link: '/faculty/attendance',
      },
      {
        key: '4',
        label: 'Mark Attendance',
        link: '/faculty/attendance/attendance-form',
      },
      {
        key: '5',
        label: 'Export Attendance',
        link: '/faculty/attendance/export',
      },
    ],
  },
];

const DesktopNavbar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        const isCollapsed = localStorage.getItem('collapsed') === 'true' || false;
        setCollapsed(isCollapsed);
    }, [])

    useEffect(() => {
        localStorage.setItem('collapsed', String(collapsed));
    }, [collapsed]);

    const {
      token: { colorBgContainer },
    } = theme.useToken();

    const pathname = usePathname() || '';
  
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}  >
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['none']} mode="inline" style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
         
        }} className={collapsed? 'max-w-[80px]' : 'max-w-[200px]'}>
            
            <div className='min-h-[15px]'></div>
  
            <Menu.Item key="icon" icon={(<BsStack style={{ fontSize: "20px" }}/>)}>
                <p className='font-[Poppins] text-[20px] font-[500]'>EduStack</p>
            </Menu.Item>
  
            <div className='min-h-[15px] mb-4 border-b border-solid border-slate-800'></div>
  

            <Menu.Item key="home" icon={<BiHomeAlt />} className={pathname.endsWith("/home") ? 'bg-blue-600  text-white': 'active: bg-transparent'}>
              <Link href="/faculty/home">Home</Link>
            </Menu.Item>
  

            <Menu.SubMenu key="sub1" icon={<BsPeople />} title="Attendance">
              <Menu.Item key="view" className={pathname.endsWith("/attendance") ? 'bg-blue-600  text-white': 'active: bg-transparent'}>
                <Link href="/faculty/attendance">View Attendance</Link>
              </Menu.Item>
              <Menu.Item key="mark" className={pathname.endsWith("/attendance-form") ? 'bg-blue-600  text-white': 'active: bg-transparent'}>
                <Link href="/faculty/attendance/attendance-form">Mark Attendance</Link>
              </Menu.Item>
              <Menu.Item key="export" className={pathname.endsWith("/home") ? 'bg-blue-600  text-white': 'active: bg-transparent'}>
                <Link href="/faculty/attendance/export">Export Attendance</Link>
              </Menu.Item>
            </Menu.SubMenu>


            <Menu.Item key="home" icon={<RxCalendar />} className={pathname.endsWith("/schedule") ? 'bg-blue-600  text-white': 'active: bg-transparent'}>
              <Link href="/faculty/home">Schedule</Link>
            </Menu.Item>

            <Menu.Item key="home" icon={<TbReport />} className={pathname.endsWith("/marks-entry") ? 'bg-blue-600  text-white': 'active: bg-transparent'}>
              <Link href="/faculty/home" >Marks Entry</Link >
            </Menu.Item>

            <Menu.Item key="home" icon={<CgProfile />} className={pathname.endsWith("/profile") ? 'bg-blue-600  text-white': 'active: bg-transparent'}>
              <Link href="/faculty/home">Profile</Link>
            </Menu.Item>


  
            <Menu.Item key="home" icon={<MdLogout />}>
              <Link href="/faculty/home">Logout</Link>
            </Menu.Item>
  
          </Menu>
        </Sider>
      </Layout>
    );
  };
  
  export default DesktopNavbar;
