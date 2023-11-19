import DesktopNavbar from "./components/desktopnavbar/DesktopNavBar";
import Navbar from "./components/navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex flex-row min-w-[100vw]">
        <DesktopNavbar />
        <section className="w-full">{children}</section>
      </div>
    </>
  );
}
