import DesktopNavbar from "./components/DesktopNavBar/DesktopNavbar"
import BottomNavbar from "./components/bottomNavbar/BottomNavbar"

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <>
        <DesktopNavbar/>
        <BottomNavbar/>
        <section>{children}</section>
        </>
        
    )
  }