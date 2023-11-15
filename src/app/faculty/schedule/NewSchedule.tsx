'use client';
import React, { useEffect, useState } from 'react';
import { DatePicker} from "keep-react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  Snackbar,
} from '@mui/material';

import {Select as AntSelect} from 'antd';

import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';

interface ClassSubjectPair {
  branch: string;
  className: string;
  classSemester: string;
  classroomSection: string;
  code: string;
  currentSemester: string;
  name: string;
  subSemester: string;
  subjectName: string;
  subjectType: string;
  year: string;
}

interface ClassSubjectPairsList extends Array<ClassSubjectPair> {}

interface TimeOption {
    value: string;
    label: string;
  }


const convertTo12HourFormat = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${formattedHour}:${minutes}${period}`;
  };

  

const NewSchedule = () => {
  const [classSubjectPairsList, setClassSubjectPairList] = useState<ClassSubjectPairsList>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedClassName, setSelectedClassName] = useState<string>('');
  const [isLabSubject, setIsLabSubject] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [subjectType, setSubjectType] = useState<string>('theory');
  const [sessionType, setSessionType] = useState<string>('single');
  const [selectedDate, setSelectedDate] = useState<any>(dayjs());
  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);
  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [date, setDate] = useState<any>('');
  const [subjectName, setSubjectName] = useState<string>('');

  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  const [scheduleSuccessful, setScheduleSuccessful] = useState<boolean>(false);

  useEffect(() => {
     console.log(date)
  }, [date]);

  const clearState = () => {
    setSelectedSubject('');
    setSelectedClassName('');
    setIsLabSubject(false);
    setSelectedBatch('');
    setSubjectType('theory');
    setSessionType('single');
    setSelectedDate(dayjs());
    setStartTime(null);
    setEndTime(null);
    setIsRepeating(false);
    setDate('');
    setSubjectName('');
    setScheduleSuccessful(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);






  const handleSubjectChange = (event: any) => {
    const selectedSubjectCode = event.target.value;
    setSelectedSubject(selectedSubjectCode);
    setSelectedBatch('');

    const selectedSubjectPair = classSubjectPairsList.find(pair => pair.code === selectedSubjectCode);
    if (selectedSubjectPair) {
      setSubjectType(selectedSubjectPair.subjectType);
    setSubjectName(selectedSubjectPair.subjectName)
    }
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };


  const submitForm = async (formData) => {
    try {
      const res = await fetch(`${window.location.origin}/api/faculty/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });



      if (!res.ok) {
        throw new Error('Failed to submit form data');
      }

      setScheduleSuccessful(true)

      


    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error('Error submitting form data:', error);
    }
  };


  const handleSubmit = () => {
    // Validation checks
    if (
      !selectedClassName ||
      !selectedSubject ||
      (isLabSubject && !selectedBatch) ||
      !selectedDate ||
      !startTime ||
      !endTime
    ) {
      // If any field is empty or falsy, set an error message and prevent submission
      setError('Please fill in all fields');
      return;
    }


  
    // Convert startTime and endTime strings to Date objects
    const parseTime = (time) => {
      const [hours, minutes] = time.split(':');
      return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
    };
  
    const startParsedTime = parseTime(startTime);
    const endParsedTime = parseTime(endTime);
  
    const startDate = new Date(selectedDate.format('YYYY-MM-DD'));
    startDate.setHours(startParsedTime.hours, startParsedTime.minutes, 0, 0);
  
    const endDate = new Date(selectedDate.format('YYYY-MM-DD'));
    endDate.setHours(endParsedTime.hours, endParsedTime.minutes, 0, 0);
  
    // Your logic for form submission
    const scheduleData = {
      selectedClassName,
      selectedSubject,
      isLabSubject,
      subjectType,
      subjectName,
      date: startDate.toISOString(),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      faculty: user.email,
      selectedBatch
    };
  
    // Call the submitForm function to send data to the API
    submitForm(scheduleData);
  };
  

  const generateTimeOptions = (): TimeOption[] => {
    const timeOptions: TimeOption[] = [];
    for (let hour = 9; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const time = `${hour < 10 ? '0' + hour : hour}:${minute === 0 ? '00' : minute}`;
        const amPm = hour < 12 ? 'AM' : 'PM';
        timeOptions.push({ value: time, label: `${hour % 12 || 12}:${minute === 0 ? '00' : minute} ${amPm}` });
      }
    }
    return timeOptions;
  };
  const timeOptions = generateTimeOptions();


  const batchOptions = [
    { value: '1', label: 'Batch 1' },
    { value: '2', label: 'Batch 2' },
    { value: '3', label: 'Batch 3' },
  ];

  const uniqueClassOptions = classSubjectPairsList.reduce((acc, pair) => {
    if (!acc[pair.className]) {
      acc[pair.className] = [];
    }
    acc[pair.className].push(pair);
    return acc;
  }, {});

  useEffect(() => {
    setIsLabSubject(subjectType === 'lab');
  }, [subjectType]);

  useEffect(() => {
    const fetchClassSubjectPairs = async () => {
      try {
        const res = await fetch(`${window.location.origin}/api/faculty/attendance`, {});
        const fetchedData = await res.json();
        setClassSubjectPairList(fetchedData?.classSubjectPairList || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchClassSubjectPairs();
  }, []);


  useEffect(() => {
    setTimeout(() => {
        if(error){
            setError('');
        }
    }, 1000)
  }, [error])

  return (
    <>

    { !scheduleSuccessful ? (
        <div className="flex items-center flex-col ">
        <h2 className="text-center font-[Poppins] font-[500] text-xl p-2 my-6 text-blue-600"> Schedule New Class</h2>
        <div className="flex flex-col items-center">
        <FormControl className='flex items-center' >
            <InputLabel>Select Class</InputLabel>
            <Select
              value={selectedClassName}
              onChange={(event) => {
                setSelectedClassName(event.target.value);
                setSelectedSubject('');
                setIsLabSubject(false);
                setSelectedBatch('');
              }}
              displayEmpty
              variant="outlined"
              label="Select Class"
              style={{ width: '70vw', maxWidth: '450px', overflow: 'hidden', textOverflow: 'ellipsis' }}
              sx={{ '&:focus': { borderColor: 'green' } }}
            >
              {Object.keys(uniqueClassOptions).map((className, index) => (
                <MenuItem key={index} value={className}>
                  {uniqueClassOptions[className][0].classSemester}SEM {className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          {selectedClassName && (
            <FormControl style={{ width: '70vw', maxWidth: '450px', marginTop: '20px', textOverflow: 'ellipsis' }}>
              <InputLabel>Select Subject</InputLabel>
              <Select
                value={selectedSubject}
                onChange={handleSubjectChange}
                displayEmpty
                label="Select Subject"
                variant="outlined"
                style={{ width: '70vw', maxWidth: '450px', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {uniqueClassOptions[selectedClassName].map((pair, index) => (
                  <MenuItem key={index} value={pair.code}>
                    {pair.subjectName} ({pair.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
  
          {isLabSubject && (
            <FormControl style={{ width: '70vw', maxWidth: '450px', marginTop: '20px', textOverflow: 'ellipsis' }}>
              <InputLabel>Lab Batch</InputLabel>
              <Select
                value={selectedBatch}
                onChange={handleBatchChange}
                displayEmpty
                variant="outlined"
                label="Lab Batch"
                style={{ width: '70vw', maxWidth: '450px', textOverflow: 'ellipsis' }}
              >
                {batchOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
  
  
  
  
  
  
     <LocalizationProvider dateAdapter={AdapterDayjs}>
         <FormControl   style={{ width: '100%', maxWidth: '100%',marginTop: '20px', textOverflow: 'ellipsis' }}>
      <MobileDatePicker defaultValue={dayjs()} label="Select Date" format='ddd, MMM D' onChange={handleDateChange} value={selectedDate}/>
      </FormControl>
      </LocalizationProvider> 
        
  
         <div className='flex flex-row justify-between mt-5 mb-4 w-full' >
  
         <FormControl style={{ width: '95%' ,marginRight: '5%'}}>
         <InputLabel>Start Time</InputLabel>
              <Select
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                displayEmpty
                variant="outlined"
                label="Start time"
              
              >
                {timeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
  
            <FormControl style={{ width: '95%' ,marginLeft: '5%'}}>
            <InputLabel>End Time</InputLabel>
              <Select
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                displayEmpty
                variant="outlined"
                label="End time"
                
              >
                {timeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
         </div>
  
         {error && (
          <div
          className='bg-red-100 w-full text-red-500 rounded-lg mx-4  mb-2 font-[Poppins] p-2 '
        >
          {error}
        </div>
         )}
  
   
  
          <button
            onClick={handleSubmit}
            className='bg-blue-500 w-full text-white rounded-lg mx-4 mt-4 mb-4 font-[Poppins] p-2 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300'
          >
            Submit
          </button>


      </div>
    </div>
  
    ) : (

    <div className='w-full mt-4'>


        <div className='flex flex-col border border-dashed border-slate-400 rounded my-2'>

        <p className='text-green-500 p-2 borderd w-full  my-2 text-center'>
            Class Scheduled Successfully!
        </p>

            <p className='pl-1 text-slate-700 font-[Poppins] text-[12px]'>Class: {selectedClassName}</p>
            <p className='pl-1 text-slate-700 font-[Poppins] text-[12px]'>Subject: {subjectName+'('+selectedSubject+')'}</p>
            <p className='pl-1 text-slate-700 font-[Poppins] text-[12px]'>Date: {selectedDate.format('DD MMM, YYYY')}</p>
            <p className='pl-1 text-slate-700 font-[Poppins] text-[12px] pb-4'>time: {convertTo12HourFormat(startTime)+'-'+convertTo12HourFormat(endTime)}</p>
        </div>

        <div>
            <button
            onClick={clearState}
            className='bg-blue-500 w-full text-white rounded-lg  mt-4 mb-4 font-[Poppins] p-2 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300'
          >
            Schedule Another Class
          </button>
        </div>
    </div>
  
    )}

</>
  );
};

export default NewSchedule;
