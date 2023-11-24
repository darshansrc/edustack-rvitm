import DesktopNavbar from "./components/DesktopNavBar/DesktopNavbar";
import BottomNavbar from "./components/bottomNavbar/BottomNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BottomNavbar />
      <div className="flex flex-row min-w-[100vw]">
        <DesktopNavbar />
        <section className="w-full">{children}</section>
      </div>
    </>
  );
}
