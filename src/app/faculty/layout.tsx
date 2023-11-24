"use client";
import { useEffect, useState } from "react";
import DesktopNavbar from "./components/DesktopNavBar/DesktopNavbar";
import BottomNavbar from "./components/bottomNavbar/BottomNavbar";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase-config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
      console.log(user);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      const getRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(getRef);

      try {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.type === "student") {
            //  router.push("/student/home");
          } else if (userData.type === "faculty") {
            router.push("/faculty/home");
          } else if (userData.type === "parent") {
            router.push("/parent/home");
          } else {
            await signOut(auth);
          }
        }
      } catch (err) {
        await signOut(auth);
      }
    };
  });

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
