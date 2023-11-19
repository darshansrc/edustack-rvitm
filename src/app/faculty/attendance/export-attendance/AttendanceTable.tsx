"use client";
import { db } from "@/lib/firebase-config";
import { Select, DatePicker } from "antd";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useRef, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import type { InputRef } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";

import { CSVLink } from "react-csv";

import styles from "./AttendanceTable.module.css";

const { RangePicker } = DatePicker;

function convertTo12HourFormat(time) {
  const date = new Date(time);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

const batchOptions = [
  { value: "1", label: "Batch 1" },
  { value: "2", label: "Batch 2" },
  { value: "3", label: "Batch 3" },
];

const AttendanceTable = () => {
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [classSubjectPairList, setClassSubjectPairList] = useState<any>([]);
  const [classId, setClassId] = useState<string>("");
  const [subjectCode, setSubjectCode] = useState<string>("");
  const [isLabSubject, setIsLabSubject] = useState<boolean>(false);
  const [labBatch, setLabBatch] = useState<string>("");
  const [subjectType, setSubjectType] = useState<string>("");
  const [subjectName, setSubjectName] = useState<string>("");
  const [subjectSemester, setSubjectSemester] = useState<string>("");
  const [isSubjectElective, setIsSubjectElective] = useState<boolean>(false);
  const [electiveStudentUSN, setElectiveStudentUSN] = useState<string[]>([]);
  const [attendanceData, setAttendanceData] = useState<any>(null);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<any>(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const csvLink = useRef<CSVLink | null>(null);

  const handleExportCSV = () => {
    if (csvLink.current) {
      csvLink.current.link.click();
    }
  };

  useEffect(() => {
    const getSubjectData = async () => {
      if (classId && subjectCode) {
        const subjectCollectionRef = doc(
          db,
          "database",
          classId,
          "subjects",
          subjectCode
        );
        const querySnapshot = await getDoc(subjectCollectionRef);
        if (querySnapshot?.data()) {
          const subjectType = querySnapshot.data()?.theoryLab;
          const subjectSemester = querySnapshot.data()?.semester;
          const subjectName = querySnapshot.data()?.name;
          setSubjectName(subjectName);
          setSubjectType(subjectType);
          setSubjectSemester(subjectSemester);

          // Move the fetchAttendanceData call here
          fetchAttendanceData(classId, subjectCode, subjectSemester);
        }
      }
    };
    getSubjectData();
  }, [classId, subjectCode]);

  async function fetchAttendanceData(classId, subjectCode, subjectSemester) {
    try {
      if (classId && subjectCode) {
        const attendanceRef = collection(
          db,
          "database",
          classId,
          "attendance",
          subjectSemester + "SEM",
          subjectCode
        );

        const snapshot = await getDocs(attendanceRef);
        const attendanceDocs = snapshot.docs.map((doc) => doc.data());

        // Filter data based on the selected date range
        const filteredData = attendanceDocs.filter((data) => {
          const classDate = new Date(data.classDate);
          return (
            (!fromDate || classDate >= fromDate) &&
            (!toDate || classDate <= toDate)
          );
        });

        const attendanceDoc = labBatch
          ? filteredData.filter((data) => data.labBatch === labBatch)
          : filteredData;

        setAttendanceData(attendanceDoc);
      }
    } catch (error) {
      console.error("Error fetching attendance data from Firestore", error);
    }
  }

  useEffect(() => {
    fetchAttendanceData(classId, subjectCode, subjectSemester);
  }, [classId, labBatch, subjectCode, fromDate, toDate]);

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
    setLabBatch("");

    const selectedSubjectPair = classSubjectPairList.find(
      (pair) => pair.code === selectedSubjectCode
    );
    if (selectedSubjectPair) {
      setSubjectType(selectedSubjectPair.subjectType);
      setIsLabSubject(selectedSubjectPair.subjectType === "lab");
    }
  };

  useEffect(() => {
    if (subjectType === "lab") {
      setIsLabSubject(true);
    } else if (subjectType === "theory") {
      setIsLabSubject(false);
    }
  }, [classId, subjectType]);

  const mergedAttendanceData = attendanceData?.reduce((mergedData, data) => {
    data?.students?.forEach((student) => {
      const existingStudentIndex = mergedData.findIndex(
        (mergedStudent) => mergedStudent.usn === student.usn
      );

      if (existingStudentIndex !== -1) {
        mergedData[existingStudentIndex].attendance[data.classStartTime] =
          student.Present;
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
    return classCount > 0
      ? ((attendanceCount / classCount) * 100).toFixed(0)
      : "N/A";
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
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
            className="bg-[#0577fb]"
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
          color: filtered ? "#1677ff" : undefined,
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
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      className: "text-[12px] font-[Poppins] z-0 ",
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "left",
      ...getColumnSearchProps("name"),
    },
    {
      className: "text-[12px] font-[Poppins] ",
      title: "USN",
      dataIndex: "usn",
      width: 100,
      key: "usn",
      ...getColumnSearchProps("usn"),
    },
    {
      className: "text-[12px] font-[Poppins] ",
      align: "center",
      title: "Classes Held",
      dataIndex: "classesHeld",
      key: "classesHeld",
      width: 100,
      sorter: (a, b) => a.classesHeld - b.classesHeld,
    },
    {
      className: "text-[12px] font-[Poppins] ",
      align: "center",
      title: "Classes Attended",
      dataIndex: "classesAttended",
      key: "classesAttended",
      width: 100,
      sorter: (a, b) => a.classesAttended - b.classesAttended,
    },
    {
      className: "text-[12px] font-[Poppins] ",
      align: "center",
      title: "Attendance Percentage",
      dataIndex: "attendancePercentage",
      key: "attendancePercentage",
      width: 100,
      sorter: (a, b) => a.attendancePercentage - b.attendancePercentage,
    },
    // Add columns for each date in attendanceData
    ...(attendanceData
      ? attendanceData.map((data) => ({
          title: (
            <div>
              {new Date(data.classDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              <br />({convertTo12HourFormat(data.classStartTime)}-
              {convertTo12HourFormat(data.classEndTime)})
            </div>
          ),
          width: 100,
          className: "text-[12px] font-[Poppins] ",
          align: "center",
          dataIndex: `attendance_${data.classStartTime}`, // Adjust accordingly
          key: `${new Date(data.classDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}_${convertTo12HourFormat(
            data.classStartTime
          )}-${convertTo12HourFormat(data.classEndTime)}`, // Adjust accordingly
        }))
      : []),
  ];

  const data = mergedAttendanceData?.map((student) => {
    const rowData = {
      className: "text-[12px] font-[Poppins] ",
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
              ? "P"
              : "A"
            : "-";
      });
    }

    return rowData;
  });

  const csvData = mergedAttendanceData?.map((student) => {
    const rowData = {
      className: "text-[12px] font-[Poppins] ",
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
        const attendanceKey = `${new Date(data.classDate).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )}_${convertTo12HourFormat(
          data.classStartTime
        )}-${convertTo12HourFormat(data.classEndTime)}`; // Adjust accordingly
        rowData[attendanceKey] =
          student.attendance[data.classStartTime] !== undefined
            ? student.attendance[data.classStartTime]
              ? "P"
              : "A"
            : "-";
      });
    }

    return rowData;
  });

  const handleDateFilterChange = (value) => {
    // Get the current date
    const today = new Date();

    // Handle different date filter options
    switch (value) {
      case "today":
        setFromDate(today);
        setToDate(today);
        break;
      case "lastWeek":
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        setFromDate(lastWeek);
        setToDate(today);
        break;
      case "lastMonth":
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        setFromDate(lastMonth);
        setToDate(today);
        break;
      case "allTime":
        // Set the earliest and latest possible dates
        setFromDate(new Date(0)); // January 1, 1970
        setToDate(new Date("9999-12-31")); // December 31, 9999
        break;
      default:
        // Custom date or any other cases
        break;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center p-4 w-full h-auto">
        <div
          style={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
          className="flex w-[95%] gap-2 flex-wrap items-end justify-left max-md:justify-left p-3 rounded-md border border-solid border-gray-100 mt-10 max-md:mt-[60px]  mb-7"
        >
          <div className="w-[20%] max-md:w-[30%]">
            <p className=" font-semibold ">Class</p>
            <Select
              size="large"
              value={classId || undefined}
              onChange={(value) => {
                setClassId(value);
                setSubjectCode("");
                setIsLabSubject(false);
                setLabBatch("");
              }}
              placeholder="Select Class"
              className="w-[100%]"
              options={Object.keys(uniqueClassOptions).map(
                (ClassId, index) => ({
                  value: ClassId,
                  label: `${uniqueClassOptions[ClassId][0].classSemester}-SEM ${ClassId}`,
                })
              )}
            />
          </div>
          {classId && (
            <div className="flex flex-col w-[40%] max-md:w-[50%]">
              <p className="ml-2 font-semibold ">Subject</p>
              <Select
                size="large"
                value={subjectCode || undefined}
                onChange={handleSubjectChange}
                className="w-[100%]"
                placeholder="Select Subject"
                options={uniqueClassOptions[classId].map((pair, index) => ({
                  value: pair.code,
                  label: pair.subjectName,
                }))}
              />
            </div>
          )}
          {isLabSubject && (
            <div className="flex flex-col w-[20%] max-md:w-[40%]">
              <p className=" font-semibold ml-4 whitespace-nowrap">Lab Batch</p>
              <Select
                size="large"
                value={labBatch || undefined}
                onChange={(value) => setLabBatch(value)}
                placeholder="Select Lab Batch"
                className="w-[100%]"
              >
                {batchOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
          {/* <button
            type="submit"
            className=" w-[15%] max-md:w-[40%] inline-flex items-center py-2 px-3 h-[75%] mt-4 text-sm font-medium text-white bg-[#0577fb]-500 rounded-lg border border-primary-300 hover:bg-[#0577fb]-400 focus:ring-4 focus:outline-none focus:ring-primary-300"
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            Search
          </button> */}
        </div>

        <div
          style={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
          className="border-solid border-gray-100 p-4 border rounded-md w-auto max-w-[90vw] h-auto"
        >
          <div className="flex flex-row flex-wrap justify-end max-md:justify-end items-center w-full ">
            {/* <div className="mr-10 max-md:mr-0 max-md:w-[100%]">
              <p className="text-[12px] font-poppins whitespace-nowrap">
                Date Range
              </p>
              <RangePicker
                size="large"
                value={[fromDate, toDate]}
                onChange={(dates) => {
                  setFromDate(dates?.[0]);
                  setToDate(dates?.[1]);
                }}
                format={"ddd, MMM D"}
                inputReadOnly
                className="w-[100%]"
              />
            </div> */}

            <div className="flex flex-row gap-2 items-center justify-center">
              <div className="flex flex-col">
                <p className="text-[12px] font-poppins whitespace-nowrap">
                  From
                </p>
                <DatePicker
                  inputReadOnly
                  size="large"
                  format={"ddd, MMM D"}
                  value={fromDate}
                  onChange={setFromDate}
                  className=" text-[16px] mt-[2px] "
                  disabledDate={(current) =>
                    current && current.valueOf() > Date.now()
                  }
                />
              </div>
              <div className="flex flex-col">
                <p className="text-[12px] font-poppins whitespace-nowrap">To</p>
                <DatePicker
                  inputReadOnly
                  size="large"
                  format={"ddd, MMM D"}
                  value={toDate}
                  onChange={setToDate}
                  className=" text-[16px] mt-[2px] "
                  disabledDate={(current) =>
                    current && current.valueOf() > Date.now()
                  }
                />
              </div>
            </div>

            {/* <div className="mr-10 w-[10%] mt-6 min-w-[100px] max-md:mr-3">
              <Select defaultValue="allTime" size="large" className="w-[100%]">
                <Select.Option value="today">Today</Select.Option>
                <Select.Option value="lastWeek">Last Week</Select.Option>
                <Select.Option value="lastMonth">Last Month</Select.Option>
                <Select.Option value="allTime">All Time</Select.Option>
              </Select>
            </div> */}
            <Button
              className=" my-2 ml-8 max-md:ml-5 max-[325px]:ml-2"
              type="primary"
              onClick={handleExportCSV}
            >
              Export to CSV
            </Button>

            <CSVLink
              ref={csvLink}
              data={csvData || []} // Make sure data is defined or provide a default value
              filename={"attendance_data.csv"}
              target="_blank"
            />
          </div>
          {
            <div className=" w-[80vw] overflow-x-auto overflow-y-auto">
              <Table
                columns={columns}
                dataSource={data}
                size="small"
                className="-z-1"
                scroll={{ x: "90vw", y: "50vh" }}
                pagination={false}
              />
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default AttendanceTable;
