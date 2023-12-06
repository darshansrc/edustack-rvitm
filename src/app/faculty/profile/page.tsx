"use client";
import { Alert, Button, Skeleton, Snackbar } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Modal from "@mui/joy/Modal";
import { ModalDialog } from "@mui/joy";
import styles from "./Profile.module.css";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { FiEdit } from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import Image from "next/image";
import TopNavbar from "@/app/student/components/topnavbar/TopNavbar";

const StudentProfile = () => {
  const storage = getStorage(); // Initialize Firebase Storage
  const photosStorageRef = ref(storage, "photos");

  interface facultyDetails {
    facultyDesignation: string;
    facultyName: string;
    facultyDepartment: string;
    userUID: string;
    photoUrl: string;
  }

  const [facultyDetails, setFacultyDetails] = useState<facultyDetails>({
    facultyDesignation: "",
    facultyName: "",
    facultyDepartment: "",
    userUID: "",
    photoUrl: "",
  });

  const [photoUrl, setPhotoUrl] = useState("");

  const [classSemester, setClassSemester] = useState("");
  const [classId, setClassId] = useState<any>(null);
  const [dataFetched, setDataFetched] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const [photoSnackbarOpen, setPhotoSnackbarOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const [user, setUser] = useState<any>(null);

  const [classSubjectPairList, setClassSubjectPairList] = useState<any>([]);

  useEffect(() => {
    try {
      const storedClassSubjectPairListString = localStorage.getItem(
        "classSubjectPairList"
      );
      if (storedClassSubjectPairListString !== null) {
        const storedList = JSON.parse(storedClassSubjectPairListString);
        setClassSubjectPairList(storedList);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const fetchClassSubjectPairs = async () => {
      try {
        const res = await fetch(
          `${window.location.origin}/api/faculty/attendance`,
          {}
        );
        const fetchedData = await res.json();
        setClassSubjectPairList(fetchedData?.classSubjectPairList || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log(classSubjectPairList);
      }
    };

    fetchClassSubjectPairs();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handlePhotoUpload = async () => {
    if (selectedPhoto) {
      const photoRef = ref(photosStorageRef, `${user.email}.jpg`);

      try {
        await uploadBytes(photoRef, selectedPhoto);
        setPhotoSnackbarOpen(true);
        closeModal();
      } catch (error) {
        console.error("Error uploading the file:", error);
        // Handle the error (e.g., show an error message)
      }
    }
  };

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
      <TopNavbar name={"Profile"} />
      <div className="flex flex-col items-center mt-14 mb-14">
        <div className="w-[95vw] max-w-xl flex flex-col  items-center border border-solid rounded-md bg-white border-slate-300 mt-4">
          <div className="relative flex flex-row justify-between items-center">
            {dataFetched ? (
              <Image
                src={photoUrl ? photoUrl : "/Default.svg"}
                alt="Student Image"
                width={112}
                height={112}
                style={{
                  objectFit: "cover",
                  boxShadow:
                    "0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)",
                }}
                className="w-28 h-28 m-6 rounded-full"
              />
            ) : (
              <Skeleton
                variant="circular"
                sx={{ width: "7rem", height: "7rem", margin: "1.5rem" }}
              />
            )}

            <div
              onClick={openModal}
              style={{
                position: "absolute",
                top: "66.66%",
                left: "66.66%",
                backgroundColor: "#fff",
                borderRadius: "50%",
                padding: "5px",
                color: "#1d4ed8",
                boxShadow:
                  "0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)",
              }}
            >
              <FiEdit />
            </div>
          </div>

          <div className="flex flex-col  p-4 font-sans  my-4 w-11/12 border border-dashed rounded-md bg-white border-slate-300 mt-2">
            <p className="text-[#0577fb] font-bold text-xs pb-1"> Name</p>
            <p className="text-sm font-medium text-neutral-700 font-[Poppins] pb-4">
              {dataFetched ? (
                facultyDetails?.facultyName
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={100}
                />
              )}
            </p>

            <p className="text-[#0577fb] font-bold text-xs pb-1">Designation</p>
            <p className="text-sm font-medium text-neutral-700 font-[Poppins] pb-4">
              {dataFetched ? (
                facultyDetails?.facultyDesignation
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={100}
                />
              )}
            </p>

            <p className="text-[#0577fb] font-bold text-xs pb-1">Department</p>
            <p className="text-sm font-medium text-neutral-700 font-[Poppins] pb-4">
              {dataFetched ? (
                facultyDetails?.facultyDepartment
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={100}
                />
              )}
            </p>

            <p className="text-[#0577fb] font-bold text-xs pb-1">
              Your Subjects
            </p>
            <table className="min-w-full bg-white border border-gray-100 rounded-[10px] font-poppins text-[12px]">
              <thead className="bg-[#fafafa] rounded-[10px]">
                <tr>
                  <th className="py-2 px-4 border-b">Class </th>
                  <th className="py-2 px-4 border-b">Subject </th>
                </tr>
              </thead>
              <tbody>
                {classSubjectPairList.map((classSubjectPair, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">
                      {classSubjectPair.className}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {classSubjectPair.subjectName} ({classSubjectPair.code})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal open={isModalOpen} onClose={closeModal}>
        <ModalDialog sx={{ width: "90vw", maxWidth: "400px" }}>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Poppins",
              fontWeight: "500",
              color: "#333",
              fontSize: "18px",
              paddingBottom: "0px",
            }}
          >
            Upload Profile Photo
          </h2>

          <div className="flex w-full items-center justify-center my-4">
            <input
              type="file"
              accept="image/*"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (!event.target.files) return;
                setSelectedPhoto(event.target.files[0]);
              }}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer flex items-center justify-center w-full h-[25vh] border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none"
            >
              <span className="text-gray-600">
                {selectedPhoto
                  ? selectedPhoto.name
                  : "Click here to select file"}
              </span>
            </label>
          </div>

          {selectedPhoto && (
            <button
              className={styles.openNavbarButton}
              onClick={handlePhotoUpload}
              style={{ color: "#0577fb", margin: "0", padding: "10px" }}
            >
              Upload
            </button>
          )}

          <button
            className={styles.openNavbarButton}
            onClick={closeModal}
            style={{ color: "rgb(244, 41, 41)", margin: "0", padding: "10px" }}
          >
            Cancel
          </button>
        </ModalDialog>
      </Modal>
      <Snackbar
        open={photoSnackbarOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setPhotoSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setPhotoSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Photo uploaded successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default StudentProfile;
