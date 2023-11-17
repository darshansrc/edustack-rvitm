"use client";

import React, { useEffect, useState } from "react";
import { BsFillPeopleFill, BsPeople, BsStack } from "react-icons/bs";
import { HiDocumentText } from "react-icons/hi";
import { IoCalendarNumber } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

import { Layout, Menu, Popconfirm, theme } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import { MdLogout } from "react-icons/md";

const { SubMenu } = Menu;
const { Sider } = Layout;

const DesktopNavbar = () => {
  const [subMenuActive, setSubMenuActive] = useState<boolean>(false);
  const pathname = usePathname() || "";

  const router = useRouter();

  const handleSignOut = async () => {
    signOut(auth);
    const response = await fetch(`${window.location.origin}/api/signout`, {
      method: "POST",
    });
    if (response.status === 200) {
      router.push("/");
    }
  };

  useEffect(() => {
    pathname.startsWith("/faculty/attendance") && setSubMenuActive(true);
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="md:hidden">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Menu mode="inline" theme="dark" defaultSelectedKeys={[pathname]}>
          <div className="min-h-[15px]"></div>

          <Menu.Item key="icon" icon={<BsStack style={{ fontSize: "20px" }} />}>
            <p className="font-[Poppins] text-[20px] font-[500]">Edustack</p>
          </Menu.Item>

          <div className="min-h-[15px] mb-4 border-b border-solid border-slate-800"></div>

          <Menu.Item key="/faculty/home" icon={<AiFillHome />}>
            <Link href={"/faculty/home"}>Home</Link>
          </Menu.Item>

          <SubMenu key="sub1" icon={<BsFillPeopleFill />} title={"Attendance"}>
            <Menu.Item key="/faculty/attendance">
              <Link href={"/faculty/attendance"}>View Attendance</Link>
            </Menu.Item>
            <Menu.Item key="/faculty/attendance/attendance-form">
              <Link href={"/faculty/attendance/attendance-form"}>
                Mark Attendance
              </Link>
            </Menu.Item>
            <Menu.Item key="/faculty/attendance/export-attendance">
              <Link href={"/faculty/attendance/export-attendance"}>
                Export Attendance
              </Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="/faculty/schedule" icon={<IoCalendarNumber />}>
            <Link href={"/faculty/schedule"}>Schedule</Link>
          </Menu.Item>

          <Menu.Item key="/faculty/marks-entry" icon={<HiDocumentText />}>
            <Link href={"/faculty/marks-entry"}>Marks Entry</Link>
          </Menu.Item>

          <Menu.Item key="/faculty/profile" icon={<FaCircleUser />}>
            <Link href={"/faculty/profile"}>Profile</Link>
          </Menu.Item>

          <Menu.Item icon={<MdLogout />}>
            <Popconfirm
              title="Log out"
              description="Are you sure you want to log out?"
              onConfirm={handleSignOut}
              okText="Yes"
              cancelText="No"
            >
              Logout
            </Popconfirm>
          </Menu.Item>
        </Menu>
      </Sider>
    </Layout>
  );
};

export default DesktopNavbar;
