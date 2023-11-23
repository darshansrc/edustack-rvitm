"use client";
import { auth, db } from "@/lib/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import styles from "./FacultyHomePage.module.css";
import Image from "next/image";
import { BsClockHistory, BsFiletypeCsv, BsPersonCheck } from "react-icons/bs";
import { RxReader } from "react-icons/rx";
import { TbReportAnalytics } from "react-icons/tb";
import { RiThreadsLine } from "react-icons/ri";
import { BiSpreadsheet } from "react-icons/bi";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { SiGooglecloud } from "react-icons/si";
import { LuPresentation } from "react-icons/lu";
import { Modal } from "antd";

interface facultyDetails {
  facultyDesignation: string;
  facultyName: string;
  facultyDepartment: string;
  userUID: string;
  photoUrl: string;
}

const FacultyHomePage = () => {
  const [facultyDetails, setFacultyDetails] = useState<facultyDetails>({
    facultyDesignation: "",
    facultyName: "",
    facultyDepartment: "",
    userUID: "",
    photoUrl: "",
  });

  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const storage = getStorage();

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

  const fetchFacultyData = async () => {
    try {
      const currentServerDomain = window.location.origin;
      const responseAPI = await fetch(
        `${currentServerDomain}/api/faculty/home`,
        {
          method: "GET",
        }
      );

      if (responseAPI.status === 200) {
        const responseBody = await responseAPI.json();

        // Include userUID and photoUrl in facultyDetails
        let updatedFacultyDetails = {
          ...responseBody.facultyDetails,
          userUID: user.uid,
          photoUrl: null, // Initialize photoUrl to null; it will be updated later
        };

        // Fetch and set photoUrl
        try {
          const url = await getDownloadURL(
            ref(storage, `photos/${user.email}.jpg`)
          );
          setPhotoUrl(url);

          updatedFacultyDetails.photoUrl = url;
        } catch (error) {
          console.log(error);
        }

        // Set facultyDetails with userUID and updated photoUrl
        setFacultyDetails(updatedFacultyDetails);

        setDataFetched(true);

        // Store updated facultyDetails in localStorage
        localStorage.setItem(
          "facultyDetails",
          JSON.stringify(updatedFacultyDetails)
        );
      } else {
        console.log("Cannot fetch data");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    const storedFacultyDetails = localStorage.getItem("facultyDetails");

    if (storedFacultyDetails) {
      const parsedFacultyDetails = JSON.parse(storedFacultyDetails);
      const userUidMatch = parsedFacultyDetails.userUID === user?.uid;

      if (userUidMatch) {
        setFacultyDetails(parsedFacultyDetails);
        setPhotoUrl(facultyDetails.photoUrl);
        setDataFetched(true);
      }
    }

    fetchFacultyData();
  }, [user]);

  return (
    <>
      <div className={styles.homePageContainer}>
        <div className={styles.welcomeCard}>
          <div style={{ marginRight: "14px" }}>
            {dataFetched ? (
              <Image
                src={photoUrl ? photoUrl : "/None.jpg"}
                alt={""}
                height={60}
                width={60}
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "0 10px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  boxShadow:
                    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)",
                }}
              />
            ) : (
              <Skeleton variant="circular" width={60} height={60} />
            )}
          </div>
          {dataFetched ? (
            <div>
              <div className={styles.studentName}>
                Welcome, {facultyDetails?.facultyName}
              </div>
              <div className={styles.studentDetail}>
                {" "}
                {facultyDetails?.facultyDesignation}, Dept. of{" "}
                {facultyDetails?.facultyDepartment}
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.studentName}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1.4rem", width: 100 }}
                />
              </div>
              <div className={styles.studentDetail}>
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 80 }} />
              </div>
            </div>
          )}
        </div>

        <div className={styles.welcomeCard}>
          <div style={{ marginRight: "15px" }}>
            <Image
              priority
              width={60}
              height={60}
              src="/logorv.png"
              alt={""}
              style={{ margin: "0 10px", borderRadius: "50%" }}
            />
          </div>
          <div>
            <div className={styles.studentName}>
              RV Institute of Technology & Management
            </div>
            <div className={styles.studentDetail}>Bangalore, Karnataka</div>
          </div>
        </div>

        <div className={styles.menuBox}>
          <Link href="/faculty/attendance/attendance-form" shallow={true}>
            <div className={styles.menuItem}>
              <div className={styles.menuItemIcon}>
                <IoMdCheckmarkCircleOutline
                  size={25}
                  style={{ margin: "0 10px", color: "#475569" }}
                />
              </div>
              <div className={styles.menuItemText}>
                Mark <br /> Attendance
              </div>
            </div>
          </Link>

          <Link href="/faculty/attendance" shallow={true}>
            <div className={styles.menuItem}>
              <div className={styles.menuItemIcon}>
                <BsPersonCheck
                  size={25}
                  style={{ margin: "0 10px", color: "#475569" }}
                />
              </div>
              <div className={styles.menuItemText}>
                View <br /> Attendance
              </div>
            </div>
          </Link>

          <Link href="/faculty/attendance/export-attendance" shallow={true}>
            <div className={styles.menuItem}>
              <div className={styles.menuItemIcon}>
                <BsFiletypeCsv
                  size={25}
                  style={{ margin: "0 10px", color: "#475569" }}
                />
              </div>
              <div className={styles.menuItemText}>
                Export <br /> Attendance
              </div>
            </div>
          </Link>

          <Link href="/faculty/schedule" shallow={true}>
            <div className={styles.menuItem}>
              <div className={styles.menuItemIcon}>
                <BsClockHistory
                  size={25}
                  style={{ margin: "0 10px", color: "#475569" }}
                />
              </div>
              <div className={styles.menuItemText}>
                Schedule <br /> Classes
              </div>
            </div>
          </Link>

          <Link href="/faculty/marks-entry" shallow={true}>
            <div className={styles.menuItem}>
              <div className={styles.menuItemIcon}>
                <TbReportAnalytics
                  size={25}
                  style={{ margin: "0 10px", color: "#475569" }}
                />
              </div>
              <div className={styles.menuItemText}>
                CIE Marks <br /> Entry
              </div>
            </div>
          </Link>

          <div className={styles.menuItem} onClick={() => setIsModalOpen(true)}>
            <div className={styles.menuItemIcon}>
              <RxReader
                size={25}
                style={{ margin: "0 10px", color: "#475569" }}
              />
            </div>
            <div className={styles.menuItemText}>
              Post <br /> Assignment
            </div>
          </div>

          <div className={styles.menuItem} onClick={() => setIsModalOpen(true)}>
            <div className={styles.menuItemIcon}>
              <LuPresentation
                size={25}
                style={{ margin: "0 10px", color: "#475569" }}
              />
            </div>
            <div className={styles.menuItemText}>
              Google <br /> Sites
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        centered={true}
      >
        {" "}
        This feature is still under Development.
      </Modal>
    </>
  );
};

export default FacultyHomePage;
