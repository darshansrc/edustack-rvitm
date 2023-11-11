'use client'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'


interface attendanceFormData {

    classId: string;
    subjectCode: string;
    subjectSemester: string;

    classDate: string;
    classStartTime: string;
    classEndTime: string;

    students: {
        studentName: string;
        studentUSN: string;
        isPresent: boolean;
    }[];

    presentCount: number;
    absentCount: number;

    recordedTime: string;
    updatedTime: string;

    recordedByEmail: string;
    recordedByName: string;

    classTopic: string;
    classDescription: string;

}

interface TimeOption {
    value: string;
    label: string;
  }


const batchOptions = [
    { value: '1', label: 'Batch 1' },
    { value: '2', label: 'Batch 2' },
    { value: '3', label: 'Batch 3' },
  ];

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

const AttendanceForm = () => {

    const [attendanceFormData, setAttendanceFormData] = useState<attendanceFormData>({
        classId: '',
        subjectCode: '',
        subjectSemester: '',
        classDate: '',
        classStartTime: '',
        classEndTime: '',
        students: [],
        presentCount: 0,
        absentCount: 0,
        recordedTime: '',
        updatedTime: '',
        recordedByEmail: '',
        recordedByName: '',
        classTopic: '',
        classDescription: '',
    
    })


    const [ formStep , setFormStep ] = useState<number>(1);

// step 1 states


    // form input states
    const [ classDate , setClassDate ] = useState<any>(dayjs());
    const [ classStartTime , setClassStartTime ] = useState<string>('');
    const [ classEndTime , setClassEndTime ] = useState<string>('');
    const [ classId, setClassId] = useState<string>('');
    const [ subjectCode , setSubjectCode ] = useState<string>('');
    const [ isLabSubject , setIsLabSubject ] = useState<boolean>(false);
    const [ labBatch, setLabBatch ] = useState<string>('');
    

    // form required data states
    const [ classSubjectPairList , setClassSubjectPairList ] = useState<any[]>([]);
    const [ subjectType, setSubjectType] = useState<string>('theory');


    


    const uniqueClassOptions = classSubjectPairList.reduce((acc, pair) => {
        if (!acc[pair.className]) {
          acc[pair.className] = [];
        }
        acc[pair.className].push(pair);
        return acc;
      }, {});

    const handleSubjectChange = (event: any) => {
        const subjectCode = event.target.value;
        setSubjectCode(subjectCode);
        setLabBatch('');
    
        const selectedSubjectPair = classSubjectPairList.find(pair => pair.code === subjectCode);
        if (selectedSubjectPair) {
          setSubjectType(selectedSubjectPair.subjectType);
        }
      };
      



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
    



    const stepOne = () => {
        return (
            <div className='flex items-center justify-center flex-col w-[100vw] min-h-[100vh] '>
            <div className="flex items-center flex-col bg-white rounded-xl border-solid border border-slate-300 p-4">
            <h2 className="text-center font-[Poppins] font-[500] text-xl p-2 my-6 text-blue-600"> Mark Attendance</h2>
            <div className="flex flex-col items-center">
            <FormControl  className='flex items-center' >
                <InputLabel>Select Class</InputLabel>
                <Select
                  value={classId}
                  onChange={(event) => {
                    setClassId(event.target.value);
                    setSubjectCode('');
                    setIsLabSubject(false);
                    setLabBatch('');
                  }}
                  displayEmpty
                  variant="outlined"
                  label="Select Class"
                  style={{ width: '70vw', maxWidth: '450px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  sx={{ '&:focus': { borderColor: 'green' } }}
                >
                  {Object.keys(uniqueClassOptions).map((ClassId, index) => (
                    <MenuItem key={index} value={ClassId}>
                      {uniqueClassOptions[ClassId][0].classSemester}SEM {ClassId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


              {classId && (
            <FormControl  style={{ width: '70vw', maxWidth: '450px', marginTop: '20px', textOverflow: 'ellipsis' }}>
              <InputLabel>Select Subject</InputLabel>
              <Select
                value={subjectCode}
                onChange={handleSubjectChange}
                displayEmpty
                label="Select Subject"
                variant="outlined"
                style={{ width: '70vw', maxWidth: '450px', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {uniqueClassOptions[classId].map((pair, index) => (
                  <MenuItem key={index} value={pair.code}>
                    {pair.subjectName} ({pair.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

           {isLabSubject && (
            <FormControl  style={{ width: '70vw', maxWidth: '450px', marginTop: '20px', textOverflow: 'ellipsis' }}>
              <InputLabel>Lab Batch</InputLabel>
              <Select
                value={labBatch}
                onChange={(event) => setLabBatch(event.target.value)}
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

        <LocalizationProvider dateAdapter={AdapterDayjs} >
         <FormControl    style={{ width: '100%', maxWidth: '100%',marginTop: '20px', textOverflow: 'ellipsis' ,}}>
      <MobileDatePicker  defaultValue={dayjs()} label="Select Date" format='ddd, MMM D' onChange={(date) => setClassDate(date)} value={classDate}/>
      </FormControl>
      </LocalizationProvider> 
        
  
         <div className='flex flex-row justify-between mt-5 mb-4 w-full' >
  
         <FormControl  style={{ width: '95%' ,marginRight: '5%'}}>
         <InputLabel>Start Time</InputLabel>
              <Select
                value={classStartTime}
                onChange={(event) => setClassStartTime(event.target.value)}
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
  
            <FormControl  style={{ width: '95%' ,marginLeft: '5%'}}>
            <InputLabel>End Time</InputLabel>
              <Select
                value={classEndTime}
                onChange={(event) => setClassEndTime(event.target.value)}
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


                <button
            onClick={() => setFormStep(2)}
            className='bg-blue-500 w-full text-white rounded-lg mx-4 mt-4 mb-4 font-[Poppins] p-2 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300'
          >
            Submit
          </button>
            </div>
            </div>
            </div>
        )
    }

    const stepTwo = () => {
        return (
            <div>
                <h1>Step Two</h1>
                <button onClick={() => setFormStep(3)}>Next</button>
            </div>
        )
    }

    const stepThree = () => {
        return (
            <div>
                <h1>Step Three</h1>
                <button onClick={() => setFormStep(1)}>Back to Home</button>
            </div>
        )
    }


  return (

        <div>
        {formStep === 1 && stepOne()}
        {formStep === 2 && stepTwo()}
        {formStep === 3 && stepThree()}
        </div>


  )
}

export default AttendanceForm