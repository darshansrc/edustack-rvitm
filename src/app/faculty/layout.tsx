'use client'; 
import { useRef } from "react"
import DesktopNavbar from "./components/DesktopNavBar/DesktopNavbar"
import BottomNavbar from "./components/bottomNavbar/BottomNavbar"
import LoadingBar from 'react-top-loading-bar'


export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    const ref = useRef(null)

    return (
        <>
        <DesktopNavbar/>
        <BottomNavbar/>
        <section>{children}</section>
        </>
        
    )
  }