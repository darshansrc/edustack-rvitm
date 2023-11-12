'use client'
import { FormControl, InputLabel,  } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'

import { DatePicker, Space, Select } from 'antd';



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

    const handleSubjectChange = (value) => {
        setSubjectCode(value);
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
            <div className="flex items-center flex-col bg-white rounded-xl border-solid border w-[90vw] max-w-[500px] border-slate-300 p-4">
            <h2 className="text-center font-[Poppins] font-[500] text-xl p-2 my-6 text-blue-600"> Mark Attendance</h2>
            <div className="flex flex-col items-center">


              
         
                <Select
                  value={classId || undefined}
                  onChange={(value) => {
                    setClassId(value);
                    setSubjectCode('');
                    setIsLabSubject(false);
                    setLabBatch('');
                  }}
                  placeholder="Select Class"
                 
                  className="w-[80vw] max-w-[450px] h-[50px] mt-5 "
               
                >
                  {Object.keys(uniqueClassOptions).map((ClassId, index) => (
                    <Select.Option key={index} value={ClassId}>
                      {uniqueClassOptions[ClassId][0].classSemester}SEM {ClassId}
                    </Select.Option>
                  ))}
                </Select>
    


              {classId && (
         
              <Select
                value={subjectCode || undefined}
                onChange={handleSubjectChange}
                className="w-[80vw] max-w-[450px] h-[50px] mt-5 "
                placeholder="Select Subject"
              >
                {uniqueClassOptions[classId].map((pair, index) => (
                  <Select.Option key={index} value={pair.code}>
                    {pair.subjectName} ({pair.code})
                  </Select.Option>
                ))}
              </Select>
       
          )}

           {isLabSubject && (
           
              <Select
                value={labBatch || undefined}
                onChange={(value) => setLabBatch(value)}
                placeholder="Select Lab Batch"
                className='w-[80vw] max-w-[450px] h-[50px] mt-5 '
               
              >
                {batchOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
      
          )}


         <DatePicker  format={'ddd, MMM D'} value={classDate} onChange={setClassDate} className='w-[80vw] max-w-[450px] h-[50px] mt-5 '/>


  
         <div className=' w-[80vw] max-w-[450px] flex flex-row justify-between mb-4' >
  
              <Select
                value={classStartTime || undefined}
                onChange={(value) => setClassStartTime(value)}
                className="w-full h-[50px] mt-5  mr-2 text-black"
                placeholder="Select Start Time"
              >
                {timeOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
  
              <Select
                value={classEndTime || undefined}
                onChange={(value) => setClassEndTime(value)}
                placeholder="Select End Time"
                className="w-full h-[50px] mt-5  ml-2"
                
              >
                {timeOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
          
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