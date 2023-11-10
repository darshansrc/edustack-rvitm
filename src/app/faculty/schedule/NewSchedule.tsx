import React, { useEffect, useState } from 'react';
import { DatePicker} from "keep-react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from '@mui/material';

import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

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


  useEffect(() => {
     console.log(date)
  }, [date]);



  const handleSubjectChange = (event: any) => {
    const selectedSubjectCode = event.target.value;
    setSelectedSubject(selectedSubjectCode);
    setSelectedBatch('');

    const selectedSubjectPair = classSubjectPairsList.find(pair => pair.code === selectedSubjectCode);
    if (selectedSubjectPair) {
      setSubjectType(selectedSubjectPair.subjectType);
    }
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handleSessionTypeChange = (event) => {
    setSessionType(event.target.value);
  };

  const handleRepeatingChange = (event) => {
    setIsRepeating(event.target.checked);
  };

  const handleSubmit = () => {
    // Add your logic to handle the form submission
    console.log('Form submitted:', {
      selectedClassName,
      selectedSubject,
      isLabSubject,
      selectedBatch,
      subjectType,
      sessionType,
      selectedDate,
      startTime,
      endTime,
      isRepeating,
    });
  };

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
        setClassSubjectPairList(fetchedData?.classSubjectPairsList || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchClassSubjectPairs();
  }, []);

  return (
    <div className="flex items-center flex-col">
      <h2 className="text-center font-[Poppins] text-slate-800 text-lg p-2"> Schedule New Class</h2>
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
      

       <div className='flex flex-row justify-between mt-5 w-full' >

        <div className='flex flex-col pr-1'>
            <p className='pl-1'>Start time</p>
       <DatePicker timePicker={setStartTime} >
      <DatePicker.Time />
       </DatePicker>
       </div>

       <div className='flex flex-col pl-1'>
            <p className='pl-1'>End time</p>
       <DatePicker timePicker={setEndTime}>
      <DatePicker.Time />
       </DatePicker>
       </div>
       </div>



 

        <button

          color="primary"
          onClick={handleSubmit}
          className='bg-blue-500 w-full text-white rounded-lg mx-4 mt-8 mb-4 font-[Poppins] p-2 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300'
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewSchedule;
