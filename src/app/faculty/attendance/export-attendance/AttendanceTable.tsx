'use client';
import { db } from '@/lib/firebase-config';
import { Select, DatePicker,  } from 'antd';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, {useRef, useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import type { InputRef } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';

import styles from './AttendanceTable.module.css';

const { RangePicker } = DatePicker;

function convertTo12HourFormat(time) {
    const date = new Date(time);

    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }
  
  const formattedTime = convertTo12HourFormat('2023-11-15T04:30:00.000Z');
  console.log(formattedTime);

const batchOptions = [
  { value: '1', label: 'Batch 1' },
  { value: '2', label: 'Batch 2' },
  { value: '3', label: 'Batch 3' },
];

const AttendanceTable = () => {
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [classSubjectPairList, setClassSubjectPairList] = useState<any>([]);
  const [classId, setClassId] = useState<string>('');
  const [subjectCode, setSubjectCode] = useState<string>('');
  const [isLabSubject, setIsLabSubject] = useState<boolean>(false);
  const [labBatch, setLabBatch] = useState<string>('');
  const [subjectType, setSubjectType] = useState<string>('');
  const [subjectName, setSubjectName] = useState<string>('');
  const [subjectSemester, setSubjectSemester] = useState<string>('');
  const [isSubjectElective, setIsSubjectElective] = useState<boolean>(false);
  const [electiveStudentUSN, setElectiveStudentUSN] = useState<string[]>([]);
  const [attendanceData, setAttendanceData] = useState<any>(null);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<any>(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  useEffect(() => {
    const getSubjectData = async () => {
      if (classId && subjectCode) {
        const subjectCollectionRef = doc(db, 'database', classId, 'subjects', subjectCode);
        const querySnapshot = await getDoc(subjectCollectionRef);
        if (querySnapshot?.data()) {
          const subjectType = querySnapshot.data()?.theoryLab;
          const subjectSemester = querySnapshot.data()?.semester;
          const subjectName = querySnapshot.data()?.name;
          setSubjectName(subjectName);
          setSubjectType(subjectType);
          setSubjectSemester(subjectSemester);
        }
      }
    };
    getSubjectData();
  }, [classId, subjectCode]);

  useEffect(() => {
    async function fetchAttendanceData() {
      try {
        if (classId && subjectCode) {
          const attendanceRef = collection(
            db,
            'database',
            classId,
            'attendance',
            subjectSemester + 'SEM',
            subjectCode
          );
  
          const snapshot = await getDocs(attendanceRef);
          const attendanceDocs = snapshot.docs.map((doc) => doc.data());
  
          // Filter data based on the selected date range
          const filteredData = attendanceDocs.filter((data) => {
            const classDate = new Date(data.classDate);
            return (!fromDate || classDate >= fromDate) && (!toDate || classDate <= toDate);
          });
  
          setAttendanceData(filteredData);
        }
      } catch (error) {
        console.error('Error fetching attendance data from Firestore', error);
      }
    }
  
    fetchAttendanceData();
  }, [classId, labBatch, subjectCode, fromDate, toDate]);
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

  useEffect(() => {
    if (subjectType === 'lab') {
      setIsLabSubject(true);
    } else if (subjectType === 'theory') {
      setIsLabSubject(false);
    }
  }, [classId, subjectType]);

  const mergedAttendanceData = attendanceData?.reduce((mergedData, data) => {
    data?.students?.forEach((student) => {
      const existingStudentIndex = mergedData.findIndex(
        (mergedStudent) => mergedStudent.usn === student.usn
      );

      if (existingStudentIndex !== -1) {
        mergedData[existingStudentIndex].attendance[data.classStartTime] = student.Present;
      } else {
        const newStudent = {
          usn: student.usn,
          name: student.name,
          attendance: { [data.classStartTime]: student.Present },
        };
        mergedData.push(newStudent);
      }
    });

    return mergedData;
  }, []);

  const getAttendancePercentage = (attendanceCount, classCount) => {
    return classCount > 0 ? ((attendanceCount / classCount) * 100).toFixed(0) : 'N/A';
  };

  const getClassCount = () => {
    return attendanceData.length;
  };

  const getAttendanceCount = (usn) => {
    return attendanceData.reduce((total, data) => {
      const student = data?.students?.find((student) => student.usn === usn);
      return total + (student && student.Present ? 1 : 0);
    }, 0);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
             
            }}
            className='bg-blue-500'
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {className: 'text-[10px] font-[Poppins] z-0 ', title: 'Name', dataIndex: 'name', key: 'name',width: 100, ...getColumnSearchProps('name')},
    {className: 'text-[10px] font-[Poppins] ', title: 'USN', dataIndex: 'usn',width: 100, key: 'usn',...getColumnSearchProps('usn'),},
    {className: 'text-[10px] font-[Poppins] ',align: 'center', title: 'Classes Held', dataIndex: 'classesHeld', key: 'classesHeld',width: 100 ,sorter: (a, b) => a.classesHeld - b.classesHeld,  },
    {className: 'text-[10px] font-[Poppins] ',align: 'center', title: 'Classes Attended', dataIndex: 'classesAttended', key: 'classesAttended',width: 100 ,sorter: (a, b) => a.classesAttended - b.classesAttended, },
    {className: 'text-[10px] font-[Poppins] ',align: 'center', title: 'Attendance Percentage', dataIndex: 'attendancePercentage', key: 'attendancePercentage', width: 100 ,sorter: (a, b) => a.attendancePercentage - b.attendancePercentage, },
    // Add columns for each date in attendanceData
    ...(attendanceData ? attendanceData.map((data) => ({
      title: new Date(data.classDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ' (' + convertTo12HourFormat(data.classStartTime) +'-' + convertTo12HourFormat(data.classEndTime)+ ')',
      width: 100,
      className: 'text-[10px] font-[Poppins] ',
      align: 'center',
      dataIndex: `attendance_${data.classStartTime}`, // Adjust accordingly
      key: `attendance_${data.classStartTime}`, // Adjust accordingly

    })) : []),
  ];
  
  const data = mergedAttendanceData?.map((student) => {
    const rowData = {
      className: 'text-[10px] font-[Poppins] ',  
      key: student.usn,
      name: student.name,
      usn: student.usn,
      classesHeld: getClassCount(),
      classesAttended: getAttendanceCount(student.usn),
      attendancePercentage: getAttendancePercentage(
        getAttendanceCount(student.usn),
        getClassCount()
      ),
    };
  
    // Add attendance data for each date
    if (attendanceData) {
      attendanceData.forEach((data) => {
        const attendanceKey = `attendance_${data.classStartTime}`; // Adjust accordingly
        rowData[attendanceKey] =
          student.attendance[data.classStartTime] !== undefined
            ? student.attendance[data.classStartTime]
              ? 'P'
              : 'A'
            : '-';
      });
    }
  
    return rowData;
  });

  


  return (
    <>
    <div className='flex flex-col items-center justify-center mt-[80px] w-full max-w-full md:flex-row md:justify-between md:px-[2.5vw] md:ml-[80px] md:mt-0'>

        <div className='flex flex-row items-center justify-center w-[430px] max-w-[80vw] md:max-w-[424px] mt-4'>

          <div className='flex flex-col items-center'>  
          <p className='text-left w-11/12 font-[Poppins] font-[500] max-w-[40vw] ml-1 text-[12px]  text-slate-600 '>
              Class
          </p>
          <Select
              size='large'
              value={classId || undefined}
              onChange={(value) => {
                  setClassId(value);
                  setSubjectCode('');
                  setIsLabSubject(false);
                  setLabBatch('');
              } }
              placeholder='Select Class'
              className='w-[200px] mr-2 max-w-[40vw]'
              options={Object.keys(uniqueClassOptions).map((ClassId, index) => ({
                  value: ClassId,
                  label: `${uniqueClassOptions[ClassId][0].classSemester}-SEM ${ClassId}`,
              }))} />
              </div>
   

          {classId && (
              <div className='flex flex-col'>
                  <p className='text-left ml-[12px] max-w-[40vw] font-[Poppins] font-[500] text-[12px]  text-slate-600 '>
                      Subject
                  </p>
                  <Select
                      size='large'
                      value={subjectCode || undefined}
                      onChange={handleSubjectChange}
                      className='w-[200px] ml-2 max-w-[40vw]'
                      placeholder='Select Subject'
                      options={uniqueClassOptions[classId].map((pair, index) => ({
                          value: pair.code,
                          label: pair.subjectName,
                      }))} />
              </div>
          )}
          </div>

          
          
          {isLabSubject && (
              <div className='flex flex-row items-center justify-center w-[430px] max-w-[83vw] mt-4'>
              <div  className='flex flex-col items-center'>
                  <p className='text-left w-[83vw] max-w-[416px] md:w-[200px]  md:max-w-[40vw] font-[Poppins] font-[500]  ml-2 text-[12px]  text-slate-600 '>
                      Lab Batch
                  </p>
                  <Select
                      size='large'
                      value={labBatch || undefined}
                      onChange={(value) => setLabBatch(value)}
                      placeholder='Select Lab Batch'
                      className='w-[83vw] max-w-[416px] md:w-[200px]  md:max-w-[40vw] '
                  >
                      {batchOptions.map((option) => (
                          <Select.Option key={option.value} value={option.value}>
                              {option.label}
                          </Select.Option>
                      ))}
                  </Select>
                  </div>
              </div>
          )}

          {/* <div>

          <p className='w-[80vw] max-w-[450px] font-[Poppins] font-[500] text-[12px]  mt-5 pl-2 text-slate-600 '>
              Date Range
          </p>
          <RangePicker
              size='large'
              value={[fromDate, toDate]}
              onChange={(dates) => {
                  setFromDate(dates?.[0]);
                  setToDate(dates?.[1]);
              } }
              inputReadOnly

              className='w-[80vw] max-w-[450px] text-[16px] mt-[2px]' />
          </div>
         */}

      </div>
      
      <div>
  {attendanceData && (
    <div className='md:pl-[80px] flex items-center justify-center mt-4 mb-[150px]'>
      <div className='max-h-[60vh] max-w-[95vw]  md:max-w-[80vw]'>
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          
          className={styles.table}
          scroll={{ x: '95vw', y: '60vh' }}
          
        />
      </div>
    </div>
  )}
</div>
          
          </>
  );
};

export default AttendanceTable;
