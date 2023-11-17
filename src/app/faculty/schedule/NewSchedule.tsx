"use client";
import React, { useEffect, useState } from "react";
import { DatePicker, Input } from "antd";
import { Select as AntSelect, message } from "antd";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import TextArea from "antd/es/input/TextArea";

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
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "pm" : "am";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${formattedHour}:${minutes}${period}`;
};

const NewSchedule = () => {
  const [classSubjectPairsList, setClassSubjectPairList] =
    useState<ClassSubjectPairsList>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [isLabSubject, setIsLabSubject] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [subjectType, setSubjectType] = useState<string>("theory");
  const [sessionType, setSessionType] = useState<string>("single");
  const [selectedDate, setSelectedDate] = useState<any>(dayjs());
  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);
  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [date, setDate] = useState<any>("");
  const [subjectName, setSubjectName] = useState<string>("");

  const [classTopic, setClassTopic] = useState<string>("");
  const [classDescription, setClassDescription] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  const [scheduleSuccessful, setScheduleSuccessful] = useState<boolean>(false);

  useEffect(() => {
    console.log(date);
  }, [date]);

  const clearState = () => {
    setSelectedSubject("");
    setSelectedClassName("");
    setIsLabSubject(false);
    setSelectedBatch("");
    setSubjectType("theory");
    setSessionType("single");
    setSelectedDate(dayjs());
    setStartTime(null);
    setEndTime(null);
    setIsRepeating(false);
    setDate("");
    setSubjectName("");
    setScheduleSuccessful(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubjectChange = (value: any) => {
    const selectedSubjectCode = value;
    setSelectedSubject(selectedSubjectCode);
    setSelectedBatch("");

    const selectedSubjectPair = classSubjectPairsList.find(
      (pair) => pair.code === selectedSubjectCode
    );
    if (selectedSubjectPair) {
      setSubjectType(selectedSubjectPair.subjectType);
      setSubjectName(selectedSubjectPair.subjectName);
    }
  };

  const handleBatchChange = (value: any) => {
    setSelectedBatch(value);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const submitForm = async (formData) => {
    try {
      const res = await fetch(
        `${window.location.origin}/api/faculty/attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit form data");
      }

      setScheduleSuccessful(true);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error submitting form data:", error);
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
      setError("Please fill in all fields");
      return;
    }

    // Convert startTime and endTime strings to Date objects
    const parseTime = (time) => {
      const [hours, minutes] = time.split(":");
      return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
    };

    const startParsedTime = parseTime(startTime);
    const endParsedTime = parseTime(endTime);

    const startDate = new Date(selectedDate.format("YYYY-MM-DD"));
    startDate.setHours(startParsedTime.hours, startParsedTime.minutes, 0, 0);

    const endDate = new Date(selectedDate.format("YYYY-MM-DD"));
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
      selectedBatch,
      classTopic,
      classDescription,
    };

    // Call the submitForm function to send data to the API
    submitForm(scheduleData);
  };

  const generateTimeOptions = (): TimeOption[] => {
    const timeOptions: TimeOption[] = [];
    for (let hour = 9; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const time = `${hour < 10 ? "0" + hour : hour}:${
          minute === 0 ? "00" : minute
        }`;
        const amPm = hour < 12 ? "AM" : "PM";
        timeOptions.push({
          value: time,
          label: `${hour % 12 || 12}:${minute === 0 ? "00" : minute} ${amPm}`,
        });
      }
    }
    return timeOptions;
  };
  const timeOptions = generateTimeOptions();

  const batchOptions = [
    { value: "1", label: "Batch 1" },
    { value: "2", label: "Batch 2" },
    { value: "3", label: "Batch 3" },
  ];

  const uniqueClassOptions = classSubjectPairsList.reduce((acc, pair) => {
    if (!acc[pair.className]) {
      acc[pair.className] = [];
    }
    acc[pair.className].push(pair);
    return acc;
  }, {});

  useEffect(() => {
    setIsLabSubject(subjectType === "lab");
  }, [subjectType]);

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

  useEffect(() => {
    setTimeout(() => {
      if (error) {
        setError("");
      }
    }, 1000);
  }, [error]);

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);

    // Parse the hours and minutes
    const [hours, minutes] = value.split(":").map(Number);

    let newHours = (hours + 1) % 24;

    if (subjectType === "lab") {
      newHours = (hours + 2) % 24;
    }

    // Format the result as "HH:mm"
    const formattedEndTime = `${newHours < 10 ? "0" : ""}${newHours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;

    setEndTime(formattedEndTime);
  };

  return (
    <>
      {!scheduleSuccessful ? (
        <div className="flex items-center flex-col ">
          <h2 className="text-center font-[Poppins] font-[500] text-xl p-2 my-4 text-blue-600">
            {" "}
            Schedule New Class
          </h2>
          <div className="flex flex-col items-center">
            <p className="text-left font-[Poppins] font-[500] text-[12px] mt-2 pl-2 text-slate-600 w-full">
              Class
            </p>
            <AntSelect
              value={selectedClassName || undefined}
              onChange={(value) => {
                setSelectedClassName(value);
                setSelectedSubject("");
                setIsLabSubject(false);
                setSelectedBatch("");
              }}
              placeholder="Select Class"
              style={{
                width: "70vw",
                maxWidth: "450px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {Object.keys(uniqueClassOptions).map((className, index) => (
                <AntSelect.Option key={index} value={className}>
                  {uniqueClassOptions[className][0].classSemester}SEM{" "}
                  {className}
                </AntSelect.Option>
              ))}
            </AntSelect>

            {selectedClassName && (
              <>
                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full">
                  Subject
                </p>
                <AntSelect
                  value={selectedSubject || undefined}
                  onChange={handleSubjectChange}
                  placeholder="Select Subject"
                  style={{
                    width: "70vw",
                    maxWidth: "450px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {uniqueClassOptions[selectedClassName].map((pair, index) => (
                    <AntSelect.Option key={index} value={pair.code}>
                      {pair.subjectName} ({pair.code})
                    </AntSelect.Option>
                  ))}
                </AntSelect>
              </>
            )}

            {isLabSubject && (
              <>
                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full">
                  Batch
                </p>
                <AntSelect
                  value={selectedBatch || undefined}
                  onChange={handleBatchChange}
                  placeholder="Select Lab Batch"
                  style={{
                    width: "70vw",
                    maxWidth: "450px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {batchOptions.map((option) => (
                    <AntSelect.Option key={option.value} value={option.value}>
                      {option.label}
                    </AntSelect.Option>
                  ))}
                </AntSelect>
              </>
            )}

            <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full">
              Date
            </p>
            <DatePicker
              defaultValue={dayjs()}
              style={{
                width: "100%",
                maxWidth: "100%",
                textOverflow: "ellipsis",
              }}
              format="ddd, MMM D"
              onChange={setSelectedDate}
              value={selectedDate || undefined}
              placeholder="Select Date"
              disabledDate={(current) =>
                current && current < dayjs().subtract(1, "day")
              }
            />

            <div className="flex flex-row justify-between   w-full">
              <div className="w-full">
                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full">
                  Start Time
                </p>
                <AntSelect
                  value={startTime || undefined}
                  onChange={handleStartTimeChange}
                  placeholder="Select Start Time"
                  className="w-11/12 mr-[8%]"
                >
                  {timeOptions.map((option) => (
                    <AntSelect.Option key={option.value} value={option.value}>
                      {option.label}
                    </AntSelect.Option>
                  ))}
                </AntSelect>
              </div>

              <div className="w-full">
                <p className="text-left ml-[8%] font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full">
                  End Time
                </p>
                <AntSelect
                  value={endTime || undefined}
                  onChange={(value) => setEndTime(value)}
                  placeholder="Select End Time"
                  className="w-11/12 ml-[8%]"
                >
                  {timeOptions.map((option) => (
                    <AntSelect.Option key={option.value} value={option.value}>
                      {option.label}
                    </AntSelect.Option>
                  ))}
                </AntSelect>
              </div>
            </div>

            <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full">
              Topic of Class
            </p>
            <Input
              placeholder="Enter Topic of Class (optional)"
              onChange={(e) => setClassTopic(e.target.value)}
            />

            <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-full">
              Class Description
            </p>
            <TextArea
              placeholder="Enter Class Description or any Instructions if necessary (optional)"
              onChange={(e) => setClassDescription(e.target.value)}
              className="mb-4"
            />

            {error && (
              <div className="bg-red-100 w-full text-red-500 rounded-lg mx-4  mb-2 font-[Poppins] p-2 ">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="bg-blue-500 w-full text-white rounded-lg mx-4 mt-4 mb-4 font-[Poppins] p-2 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full mt-4">
          <div className="flex flex-col border border-dashed border-slate-400 rounded my-2">
            <p className="text-green-500 p-2 borderd w-full  my-2 text-center">
              Class Scheduled Successfully!
            </p>

            <p className="pl-1 text-slate-700 font-[Poppins] text-[12px]">
              Class: {selectedClassName}
            </p>
            <p className="pl-1 text-slate-700 font-[Poppins] text-[12px]">
              Subject: {subjectName + "(" + selectedSubject + ")"}
            </p>
            <p className="pl-1 text-slate-700 font-[Poppins] text-[12px]">
              Date: {selectedDate.format("DD MMM, YYYY")}
            </p>
            <p className="pl-1 text-slate-700 font-[Poppins] text-[12px] pb-4">
              time:{" "}
              {convertTo12HourFormat(startTime) +
                "-" +
                convertTo12HourFormat(endTime)}
            </p>
          </div>

          <div>
            <button
              onClick={clearState}
              className="bg-blue-500 w-full text-white rounded-lg  mt-4 mb-4 font-[Poppins] p-2 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
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
