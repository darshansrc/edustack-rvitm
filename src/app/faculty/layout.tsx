import DesktopNavbar from "./components/DesktopNavBar/DesktopNavbar"

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <>
        <DesktopNavbar/>
        <section>{children}</section>
        </>
        
    )
  }