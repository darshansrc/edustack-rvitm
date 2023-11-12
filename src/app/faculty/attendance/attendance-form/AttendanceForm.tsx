import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker, Select } from 'antd';
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar';

interface AttendanceFormData {
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
  const [attendanceFormData, setAttendanceFormData] = useState<AttendanceFormData>({
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
  });

  const [formStep, setFormStep] = useState<number>(1);

  // step 1 states
  const [classDate, setClassDate] = useState<any>(dayjs());
  const [classStartTime, setClassStartTime] = useState<string>('');
  const [classEndTime, setClassEndTime] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  const [subjectCode, setSubjectCode] = useState<string>('');
  const [isLabSubject, setIsLabSubject] = useState<boolean>(false);
  const [labBatch, setLabBatch] = useState<string>('');

  // form required data states
  const [classSubjectPairList, setClassSubjectPairList] = useState<any[]>([]);
  const [subjectType, setSubjectType] = useState<string>('theory');
  const [step1Error, setStep1Error] = useState<string>('');

  const uniqueClassOptions = classSubjectPairList.reduce((acc, pair) => {
    if (!acc[pair.className]) {
      acc[pair.className] = [];
    }
    acc[pair.className].push(pair);
    return acc;
  }, {});

  const handleSubjectChange = (value: any) => {
    const selectedSubjectCode = value;

    setSubjectCode(selectedSubjectCode);
    setLabBatch('');

    const selectedSubjectPair = classSubjectPairList.find((pair) => pair.code === selectedSubjectCode);
    if (selectedSubjectPair) {
      setSubjectType(selectedSubjectPair.subjectType);
      setIsLabSubject(selectedSubjectPair.subjectType === 'lab');
    }
  };

  const handleStep1Submit = () => {
    if (!classId || !subjectCode || !classDate || !classStartTime || !classEndTime || (isLabSubject && !labBatch)) {
      setStep1Error('Please fill all the fields');
    } else {
      setFormStep(2);
      console.log({
        classId,
        subjectCode,
        classDate,
        classStartTime,
        classEndTime,
        isLabSubject,
        labBatch,
      });
    }
  };

  setTimeout(() => {
    setStep1Error('');
  }, 6000);

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

  const handleStartTimeChange = (value: string) => {
    setClassStartTime(value);
    
    // Parse the hours and minutes
    const [hours, minutes] = value.split(':').map(Number);

    let newHours = (hours + 1) % 24;
    
    if(subjectType === 'lab') {
      newHours = (hours + 2) % 24;
    }
    
    
    // Format the result as "HH:mm"
    const formattedEndTime = `${newHours < 10 ? '0' : ''}${newHours}:${minutes < 10 ? '0' : ''}${minutes}`;
    
    setClassEndTime(formattedEndTime);
  };

  const stepOne = () => {
    return (
      <div className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center justify-center flex-col w-[100vw] min-h-[100vh] '>
        <div className='flex items-center flex-col bg-white rounded-xl border-solid border w-[90vw] max-w-[500px] border-slate-300 p-4'>
          <h2 className='text-center font-[Poppins] font-[500] text-xl p-2 my-6 text-blue-600'> Mark Attendance</h2>
          <div className='flex flex-col items-center'>
            <p className='text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full'>Class</p>
            <Select
              size='large'
              value={classId || undefined}
              onChange={(value) => {
                setClassId(value);
                setSubjectCode('');
                setIsLabSubject(false);
                setLabBatch('');
              }}
              placeholder='Select Class'
              className='w-[80vw] max-w-[450px]  '
              options={Object.keys(uniqueClassOptions).map((ClassId, index) => ({
                value: ClassId,
                label: `${uniqueClassOptions[ClassId][0].classSemester}-SEM ${ClassId}`,
              }))}
            />

            {classId && (
              <>
              <p className='text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full'>Subject</p>
              <Select
                size='large'
                value={subjectCode || undefined}
                onChange={handleSubjectChange}
                className='w-[80vw] max-w-[450px]  text-[16px] mt-[2px]'
                placeholder='Select Subject'
                options={uniqueClassOptions[classId].map((pair, index) => ({
                  value: pair.code,
                  label: pair.subjectName,
                }))} />
                </>
            )}

            {isLabSubject && (
              <>
              <p className='text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full'>Lab Batch</p>
              <Select
                size='large'
                value={labBatch || undefined}
                onChange={(value) => setLabBatch(value)}
                placeholder='Select Lab Batch'
                className='w-[80vw] max-w-[450px] text-[16px] mt-[2px]'
              >
                {batchOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              </>

            )}

            <p className='text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full'>Date</p>  
            <DatePicker
              inputReadOnly
              size='large'
              format={'ddd, MMM D'}
              value={classDate}
              onChange={setClassDate}
              className='w-[80vw] max-w-[450px]  text-[16px] mt-[2px]'
            />

            <div className=' w-[80vw] max-w-[450px] flex flex-row justify-between mb-4 text-[16px]'>

              <div className='w-full'>
            <p className='text-left flex whitespace-nowrap font-[Poppins] mt-5 font-[500] text-[12px] pl-2 text-slate-600 w-11/12'>Start Time</p>
              <Select
                size='large'
                value={classStartTime || undefined}
                onChange={handleStartTimeChange}
                className='w-[95%]    mr-2 text-black text-[16px] mt-[2px]'
                placeholder='Select Start Time'
              >
                {timeOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              </div>

              <div className='w-full'>
              <p className='text-left whitespace-nowrap font-[Poppins] font-[500] text-[12px] mt-5 ml-4 text-slate-600 w-11/12'>End Time</p>
              <Select
                size='large'
                value={classEndTime || undefined}
                onChange={(value) => setClassEndTime(value)}
                placeholder='Select End Time'
                className='w-[95%]   ml-2 text-[16px] mt-[2px]'
              >
                {timeOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              </div>
            </div>

            {step1Error && (
              <p className='bg-red-100 w-full text-red-500 rounded-lg mx-4  mb-2 font-[Poppins] p-2 '>{step1Error}</p>
            )}

            <button
              onClick={handleStep1Submit}
              className='bg-blue-500 w-full text-white rounded-lg mx-4 mt-4 mb-4 font-[Poppins] p-2 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300'
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const stepTwo = () => {
    return (
      <div>
        <h1>Step Two</h1>
        <button onClick={() => setFormStep(3)}>Next</button>
      </div>
    );
  };

  const stepThree = () => {
    return (
      <div>
        <h1>Step Three</h1>
        <button onClick={() => setFormStep(1)}>Back to Home</button>
      </div>
    );
  };

  return (
    <div>
      <TopNavbar name='Mark Attendance' />
      {formStep === 1 && stepOne()}
      {formStep === 2 && stepTwo()}
      {formStep === 3 && stepThree()}
    </div>
  );
};

export default AttendanceForm;
