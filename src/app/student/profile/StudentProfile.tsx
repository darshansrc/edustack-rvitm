'use client';
import { Alert, Button , Skeleton, Snackbar } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import Modal from '@mui/joy/Modal';
import { ModalDialog } from '@mui/joy';
import styles from './StudentProfile.module.css'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const storage = getStorage(); // Initialize Firebase Storage
const photosStorageRef = ref(storage, 'photos');





const StudentProfile = () => {

  interface studentDetails {
    studentName: string;
    studentUSN: string;
    className: string;
    classSemester: string;
    studentLabBatch: string;
    studentPhoto: string;
  }
  
  const [ studentDetails, setStudentDetails ] = useState<studentDetails>({
    studentName: '',
    studentUSN: '',
    className: '',
    classSemester: '',
    studentLabBatch: '',
    studentPhoto: '',
  });

  const [classSemester, setClassSemester] = useState('');
  const [classId, setClassId] = useState<any>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const [ photoSnackbarOpen, setPhotoSnackbarOpen ] = useState(false);

  const action = (
    <React.Fragment>

      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setPhotoSnackbarOpen(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  // ... Your existing state and useEffect code ...

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null)
  };

  const handlePhotoUpload = async () => {
    if (selectedPhoto) {
      const photoRef = ref(photosStorageRef, `${userEmail}`);
      
      try {
        await uploadBytes(photoRef, selectedPhoto);
        setPhotoSnackbarOpen(true);
        closeModal();
      } catch (error) {
        console.error('Error uploading the file:', error);
        // Handle the error (e.g., show an error message)
      }
    }
  };
 

  useEffect(() => {
    async function fetchAttendanceData() {
      try {
        const currentServerDomain = window.location.origin;
        const responseAPI = await fetch(`${currentServerDomain}/api/student/home`, {
          method: 'GET',
        });
        if (responseAPI.status === 200) {
          const responseBody = await responseAPI.json();
          setStudentDetails(responseBody.studentDetails);        
          setClassId(responseBody.studentDetails.className);
          setClassSemester(responseBody.studentDetails.classSemester);
          setUserEmail(responseBody.decodedClaims.email);
          setDataFetched(true);


        } else {
          console.log('Cannot fetch data');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }

    fetchAttendanceData();
  }, []);

  




  return (
    <><div className='flex flex-col items-center bg-neutral-50'>
          <div className='w-[95vw] max-w-xl flex flex-col  items-center border border-solid rounded-md bg-white border-slate-300 mt-4'>
              <div className='flex flex-row justify-between items-center'>
                  <img
                      src={studentDetails ? studentDetails.studentPhoto : 'None.jpg'}
                      alt='student'
                      className='w-36 h-36 p-6 rounded-full' />
                  <Button
                      variant='outlined'
                      color='primary'
                      onClick={openModal}
                  >
                      Upload Photo
                  </Button>
              </div>


              <div className='flex flex-col  p-4 font-sans  my-4 w-11/12 border border-solid rounded-md bg-white border-slate-300 mt-2'>
                  <p className='text-blue-700 font-bold text-xs pb-1'>Your Name</p>
                  <p className='text-sm font-medium text-neutral-700 font-[Poppins] pb-4'>{dataFetched ? studentDetails?.studentName : <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />}</p>

                  <p className='text-blue-700 font-bold text-xs pb-1'>Your USN</p>
                  <p className='text-sm font-medium text-neutral-700 font-[Poppins] pb-4'>{dataFetched ? studentDetails?.studentUSN : <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />}</p>

                  <p className='text-blue-700 font-bold text-xs pb-1'>Your Email</p>
                  <p className='text-sm font-medium text-neutral-700 font-[Poppins] pb-4'>{dataFetched && userEmail ? userEmail : <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />}</p>

                  <p className='text-blue-700 font-bold text-xs pb-1'>Your Class</p>
                  <p className='text-sm font-medium text-neutral-700 font-[Poppins] pb-4'>{dataFetched ? studentDetails.className + ' [' + studentDetails.classSemester + '-Semester]' : <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />}</p>

                  <p className='text-blue-700 font-bold text-xs pb-1'>Lab Batch</p>
                  <p className='text-sm font-medium text-neutral-700 font-[Poppins] pb-4'>{dataFetched ? 'B-' + studentDetails.studentLabBatch : <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />}</p>

              </div>




          </div>
      </div><Modal
          open={isModalOpen}
          onClose={closeModal}
      >
              <ModalDialog sx={{width: '90vw',maxWidth: '400px'}}>
               
                      <h2 style={{
                          textAlign: 'center',
                          fontFamily: 'Poppins',
                          fontWeight: '500',
                          color: '#333',
                          fontSize: '18px',
                          paddingBottom: '0px',
                      }}>Upload Profile Photo</h2>

                      
                      <div className='flex w-full items-center justify-center my-4'>
                        <input
                          type='file'
                          accept='image/*'
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            if (!event.target.files) return
                            setSelectedPhoto(event.target.files[0])
                          }}
                          className="hidden"
                          id="file-input"
                        />
                        <label htmlFor="file-input" className="cursor-pointer flex items-center justify-center w-full h-[25vh] border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none">
                          <span className="text-gray-600">{selectedPhoto ? selectedPhoto.name : 'Click here to select file'}</span>
                        </label>
                        </div> 

                        {
                            selectedPhoto && (

                      <button  className={styles.openNavbarButton} onClick={handlePhotoUpload} style={{ color: 'rgb(29 78 216)' , margin: '0', padding: '10px' }}>
                      Upload
                  </button>
                            )
                        }

                      <button className={styles.openNavbarButton} onClick={closeModal} style={{ color: 'rgb(244, 41, 41)', margin: '0', padding: '10px' }}>
                          Cancel
                      </button>
                 
              </ModalDialog>
          </Modal>
          <Snackbar
        open={photoSnackbarOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setPhotoSnackbarOpen(false)}
      >
              <Alert onClose={() => setPhotoSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
      Photo uploaded successfully!
      </Alert>
      </Snackbar>

      </>
  )
}

export default StudentProfile