"use client";

import React, { useState, useEffect } from "react";
import styles from "./ScheduleDashboard.module.css";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import { Alert, Modal as AntdModal, Button, Popconfirm } from "antd";
import { Timeline } from "keep-react";
import { ArrowRight, CalendarBlank } from "phosphor-react";
import { TiDeleteOutline } from "react-icons/ti";

import { DatePicker, Input } from "antd";
import { Select as AntSelect, message } from "antd";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { Checkbox } from "antd";

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
  faculties: string[];
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

interface ScheduleEvent {
  selectedSubject: string;
  isLabSubject: boolean;
  subjectType: string;
  date: string;
  selectedClassName: string;
  subjectName: string;
  faculty: string[];
  startTime: string;
  endTime: string;
  selectedBatch: string;
  classTopic: string;
  classDescription: string;
  isScheduleRepeating?: boolean;
  repeatingStartDate?: string;
  repeatingEndDate?: string;
  repeatingDay?: string;
}

interface ScheduleData {
  queryResult: ScheduleEvent[];
}

const ScheduleDashboard = () => {
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<Date>(
    new Date()
  );
  const [currentWeekDates, setCurrentWeekDates] = useState<Date[]>([]);
  const [scheduleClassModalOpen, setScheduleClassModalOpen] =
    useState<boolean>(false);

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

  const [messageApi, contextHolder] = message.useMessage();

  const [repeatingStartDate, setRepeatingStartDate] = useState<any>(dayjs());
  const [repeatingEndDate, setRepeatingEndDate] = useState<any>(dayjs());

  const [subjectFaculty, setSubjectFaculty] = useState<any>([]);

  const [isScheduleRepeating, setIsScheduleRepeating] =
    useState<boolean>(false);

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
      setSubjectFaculty(selectedSubjectPair.faculties);
    }
  };

  const handleBatchChange = (value: any) => {
    setSelectedBatch(value);
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

      messageApi.open({
        type: "success",
        content: "Class Scheduled Successfully",
      });
      setScheduleSuccessful(true);
      setScheduleClassModalOpen(false);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error submitting form data:", error);
    }
  };

  const handleSubmit = () => {
    // Validation checks
    if (
      !isScheduleRepeating &&
      (!selectedClassName ||
        !selectedSubject ||
        (isLabSubject && !selectedBatch) ||
        !selectedDate ||
        !startTime ||
        !endTime)
    ) {
      // If any field is empty or falsy, set an error message and prevent submission
      setError("Please fill in all fields");
      return;
    }

    if (
      isScheduleRepeating &&
      (!selectedClassName ||
        !selectedSubject ||
        (isLabSubject && !selectedBatch) ||
        !repeatingStartDate ||
        !repeatingEndDate ||
        !selectedWeekDay ||
        !startTime ||
        !endTime)
    ) {
      // If any field is empty or falsy, set an error message and prevent submission
      setError("Please fill in all fields");
      return;
    }

    // Convert startTime and endTime strings to Date objects
    const parseTime = (time) => {
      const [hours, minutes] = time.split(":");
      return {
        hours: parseInt(hours, 10),
        minutes: parseInt(minutes, 10),
      };
    };

    const startParsedTime = parseTime(startTime);
    const endParsedTime = parseTime(endTime);

    let startDate;
    let endDate;

    let scheduleDataSubmit;

    if (!isScheduleRepeating) {
      startDate = new Date(selectedDate.format("YYYY-MM-DD"));
      startDate.setHours(startParsedTime.hours, startParsedTime.minutes, 0, 0);

      endDate = new Date(selectedDate.format("YYYY-MM-DD"));
      endDate.setHours(endParsedTime.hours, endParsedTime.minutes, 0, 0);
      // Your logic for form submission
      scheduleDataSubmit = {
        isScheduleRepeating,
        selectedClassName,
        selectedSubject,
        isLabSubject,
        subjectType,
        subjectName,
        date: startDate.toISOString(),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        faculty: subjectFaculty,
        selectedBatch,
        classTopic,
        classDescription,
      };
    } else {
      startDate = new Date(repeatingStartDate?.format("YYYY-MM-DD"));
      startDate.setHours(startParsedTime.hours, startParsedTime.minutes, 0, 0);

      endDate = new Date(repeatingEndDate?.format("YYYY-MM-DD"));
      endDate.setHours(endParsedTime.hours, endParsedTime.minutes, 0, 0);

      scheduleDataSubmit = {
        isScheduleRepeating,
        selectedClassName,
        selectedSubject,
        isLabSubject,
        subjectType,
        subjectName,
        repeatingStartDate,
        repeatingEndDate,

        date: startDate.toISOString(),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        repeatingDay: selectedWeekDay,
        faculty: subjectFaculty,
        selectedBatch,
      };
    }

    // Call the submitForm function to send data to the API
    submitForm(scheduleDataSubmit);
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

  // New Schedule

  const initializeCurrentWeek = () => {
    const currentDate = new Date(selectedScheduleDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      if (i > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weekDates.push(new Date(currentDate));
    }
    setCurrentWeekDates(weekDates);
  };

  useEffect(() => {
    initializeCurrentWeek();
  }, [selectedScheduleDate]);

  const handleDateClick = (date: Date) => {
    setSelectedScheduleDate(date);
  };

  const handleWeekChange = (change: number) => {
    const newDate = new Date(selectedScheduleDate);
    newDate.setDate(selectedScheduleDate.getDate() + 7 * change);
    setSelectedScheduleDate(newDate);
  };

  const handleTodayClick = () => {
    setSelectedScheduleDate(new Date());
  };

  const todayDate = new Date();
  const formattedDate = todayDate.toDateString();
  const selectedDateDate = selectedScheduleDate.toDateString();

  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}/api/faculty/schedule`
        );
        const data: ScheduleData = await response.json();
        console.log(scheduleData);
        setScheduleData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [scheduleClassModalOpen]);

  const handleDeleteSession = async (index: number) => {
    try {
      const sessionToDelete = scheduleData?.queryResult[index];

      console.log("Deleting session at index:", sessionToDelete);

      const response = await fetch(
        `${window.location.origin}/api/faculty/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deleteSession: true,
            selectedClassName: sessionToDelete?.selectedClassName,
            date:
              sessionToDelete?.date +
              "-" +
              sessionToDelete?.startTime +
              "-" +
              sessionToDelete?.endTime +
              "-" +
              sessionToDelete?.selectedSubject +
              "-" +
              sessionToDelete?.selectedBatch,
            // Include any other necessary data for identification
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete session: ${response.statusText}`);
      }
      if (response.ok) {
        messageApi.open({
          type: "success",
          content: "Schedule Deleted Successfully",
        });
      }

      // Update the local state to reflect the deletion
      const updatedScheduleData = [...(scheduleData?.queryResult || [])];
      updatedScheduleData.splice(index, 1);
      setScheduleData({ queryResult: updatedScheduleData });
    } catch (error) {
      console.error("Error deleting session:", error);
      // Handle error, show user a message, etc.
    }
  };

  const router = useRouter();

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [selectedWeekDay, setSelectedWeekDay] = useState("");

  const handleWeekDayChange = (value: string) => {
    console.log(`Selected day: ${value}`);
    setSelectedWeekDay(value);
    // You can do something with the selected day here, such as updating state
  };

  const { RangePicker } = DatePicker;

  const handleDateChange = (dates) => {
    // 'dates' is an array containing [from, to] dates
    setRepeatingStartDate(dates[0]);
    setRepeatingEndDate(dates[1]);
    console.log(dates[0]);
    console.log(dates[0]);
  };

  const onRepeatingChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
    setIsScheduleRepeating(e.target.checked);
  };

  const renderScheduleTimeline = () => {
    // Filter events for the selected date
    const selectedDateEvents = scheduleData?.queryResult.filter(
      (event) =>
        (event.isScheduleRepeating &&
          event.repeatingStartDate &&
          event.repeatingEndDate &&
          new Date(event.repeatingStartDate) <= selectedScheduleDate &&
          new Date(event.repeatingEndDate) >= selectedScheduleDate &&
          event.repeatingDay ===
            selectedScheduleDate.toLocaleString("en-US", {
              weekday: "long",
            })) ||
        (!event.isScheduleRepeating &&
          event.date &&
          new Date(event.date).toDateString() ===
            selectedScheduleDate.toDateString())
    );

    // Sort events by startTime
    selectedDateEvents?.sort((a, b) => {
      const timeA =
        new Date(a.startTime).getUTCHours() * 60 +
        new Date(a.startTime).getUTCMinutes();
      const timeB =
        new Date(b.startTime).getUTCHours() * 60 +
        new Date(b.startTime).getUTCMinutes();
      return timeA - timeB;
    });

    if (!selectedDateEvents || selectedDateEvents.length === 0) {
      return (
        <div className={styles.noClassContainer}>
          No classes scheduled for this day.
        </div>
      );
    }

    const formatTime = (date) => {
      date = new Date(date);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    };

    const fullformatTime = (date) => {
      date = new Date(date);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const time = `${hours}:${minutes}`;
      console.log(time);
      return time;
    };

    const getRepeatingScheduleDates = (event) => {
      const startDate = new Date(event.repeatingStartDate);
      const endDate = new Date(event.repeatingEndDate);
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const dates: Date[] = [];
      let currentDate: Date = new Date(startDate);

      while (currentDate <= endDate) {
        if (daysOfWeek[currentDate.getDay()] === event.repeatingDay) {
          dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    };

    const repeatingDates = selectedDateEvents
      .filter((event) => event.isScheduleRepeating)
      .flatMap((event) => getRepeatingScheduleDates(event));

    const allSelectedDateEvents = [...selectedDateEvents, ...repeatingDates];

    const isDatePast = (selectedDate) => {
      const today = new Date();
      return selectedDate > today;
    };

    const sortedEvents = selectedDateEvents.sort((a, b) => {
      if (a.isScheduleRepeating && !b.isScheduleRepeating) {
        return 1;
      } else if (!a.isScheduleRepeating && b.isScheduleRepeating) {
        return -1;
      } else {
        // For events with the same type (repeating or non-repeating), maintain original order
        return 0;
      }
    });

    return (
      <div className="flex flex-col w-[95vw] max-w-[550px] my-8 px-6 relative">
        {sortedEvents.map((event, index) => (
          <Timeline key={index} timelineBarType="dashed" gradientPoint={true}>
            <Timeline.Item>
              <Timeline.Point icon={<CalendarBlank size={16} />} />
              <Timeline.Content>
                <Timeline.Time>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </Timeline.Time>

                <div className="border border-solid border-slate-200 rounded bg-white flex flex-col justify-center p-[12px] mt-2 pr-[30px]">
                  <div className="text-slate-500 font-[Poppins] text-[12px]  ">
                    <span className="text-[#0577fb] font-[Poppins] text-[12px]">
                      Subject:{" "}
                    </span>
                    {event.subjectName}
                  </div>
                  <div className="text-slate-500 font-[Poppins] text-[12px]">
                    <span className="text-[#0577fb] font-[Poppins] text-[12px]  ">
                      Class:{" "}
                    </span>
                    {event.selectedClassName}
                  </div>

                  {event.isLabSubject && (
                    <div className="text-slate-500 font-[Poppins] text-[12px]">
                      <span className="text-[#0577fb] font-[Poppins] text-[12px]  ">
                        Lab Batch:{" "}
                      </span>
                      B-{event?.selectedBatch}
                    </div>
                  )}

                  <div className="text-slate-500 font-[Poppins] text-[12px]">
                    <span className="text-[#0577fb] font-[Poppins] text-[12px]  ">
                      Event Type:{" "}
                    </span>
                    {event?.isScheduleRepeating ? "Repeating" : "Non-Repeating"}
                  </div>

                  <div className="text-slate-500 font-[Poppins] text-[12px]">
                    <span className="text-[#0577fb] font-[Poppins] text-[12px]  ">
                      Faculty:{" "}
                    </span>
                    {event?.faculty ? event?.faculty.join(", ") : "-"}
                  </div>

                  {event.classTopic && (
                    <div className="text-slate-500 font-[Poppins] text-[12px]">
                      <span className="text-[#0577fb] font-[Poppins] text-[12px]  ">
                        Topic:{" "}
                      </span>
                      {event?.classTopic}
                    </div>
                  )}

                  {event.classDescription && (
                    <div className="text-slate-500 font-[Poppins] text-[12px]">
                      <span className="text-[#0577fb] font-[Poppins] text-[12px]  ">
                        Description:{" "}
                      </span>
                      {event?.classDescription}
                    </div>
                  )}

                  <div className="flex flex-row gap-2 max-w-[70%] my-2">
                    {event &&
                      event.selectedClassName &&
                      event.selectedSubject &&
                      event.date &&
                      event.startTime &&
                      event.endTime && (
                        <Button
                          type="primary"
                          size="small"
                          disabled={isDatePast(selectedScheduleDate)}
                        >
                          <Link
                            href={{
                              pathname: "/faculty/attendance/attendance-form",
                              query: {
                                classId: event.selectedClassName,
                                subjectCode: event.selectedSubject,
                                classDate:
                                  dayjs(selectedScheduleDate).format(
                                    "YYYY-MM-DD"
                                  ),
                                classStartTime: fullformatTime(event.startTime),
                                classEndTime: fullformatTime(event.endTime),
                                classTopic: event.classTopic,
                                classDescription: event.classDescription,
                              },
                            }}
                          >
                            Mark Attendance
                          </Link>
                        </Button>
                      )}

                    <Button
                      size="small"
                      className="border border-solid border-red-500 text-red-500"
                    >
                      <Popconfirm
                        title={
                          event?.isScheduleRepeating
                            ? "Delete this repeating Schedule"
                            : "Delete Schedule"
                        }
                        description={
                          event?.isScheduleRepeating
                            ? "Are you sure to delete this Schedule? If you delete this event it will also be deleted for all other repeated sessions"
                            : "Are you sure to delete this Schedule?"
                        }
                        onConfirm={() => handleDeleteSession(index)}
                        okText="Yes"
                        cancelText="No"
                      >
                        Delete
                      </Popconfirm>
                    </Button>
                  </div>
                </div>
              </Timeline.Content>
            </Timeline.Item>
          </Timeline>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="">
        <div className={styles.scheduleContainer}>
          <div className={styles.schedulePage}>
            <div className="mt-14 md:mt-0">
              <div className="md:block hidden font-poppins pl-4 pt-2 pb-4 font-[400] text-[#0577fb] text-[20px]">
                Your Schedule
              </div>
              <Alert
                message="Schedule and manage classes with ease. Leave topic descriptions and instructions for students prior to class. Mark attendance fast in the class with pre-scheduled classes."
                type="info"
                showIcon
                className="my-3"
              />
              <div className={styles.selectedDateBar}>
                <div className={styles.selectedDate}>
                  {selectedScheduleDate.toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                <div className="flex flex-row gap-2">
                  <div
                    onClick={() => setScheduleClassModalOpen(true)}
                    className="bg-[#0577fb] px-2 text-white border border-[#0577fb] p-1 rounded flex items-center justify-center font-poppins text-xs cursor-pointer"
                  >
                    <FaPlus /> New Schedule
                  </div>

                  <div
                    onClick={() =>
                      formattedDate === selectedDateDate
                        ? null
                        : handleTodayClick()
                    }
                    className={
                      formattedDate === selectedDateDate
                        ? styles.todayButtonDisabled
                        : styles.todayButton
                    }
                    style={{ padding: "5px 10px", marginRight: "15px" }}
                  >
                    Today
                  </div>
                </div>
              </div>

              <div className={styles.dateGrid}>
                <div
                  onClick={() => handleWeekChange(-1)}
                  className={styles.button}
                >
                  <IoChevronBackSharp />
                </div>
                {currentWeekDates.map((date, index) => {
                  const isSelected =
                    date.toDateString() === selectedScheduleDate.toDateString();
                  const todayDate = date.toDateString() === formattedDate;
                  return (
                    <div className={styles.dateContainer} key={index}>
                      <span
                        onClick={() => handleDateClick(date)}
                        className={`${styles.date} ${
                          isSelected
                            ? styles.selectedDateDiv
                            : todayDate
                            ? styles.currentDateDiv
                            : ""
                        }`}
                      >
                        {date.getDate()}
                        <div className={styles.day}>
                          {date.toLocaleString("en-US", { weekday: "short" })}
                        </div>
                      </span>
                    </div>
                  );
                })}
                <div
                  onClick={() => handleWeekChange(1)}
                  className={styles.button}
                >
                  <IoChevronForwardSharp />
                </div>
              </div>
            </div>
          </div>
          {renderScheduleTimeline()}
        </div>
      </div>

      <AntdModal
        centered
        open={scheduleClassModalOpen}
        onCancel={() => {
          setScheduleClassModalOpen(false);
          clearState();
        }}
        onOk={handleSubmit}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setScheduleClassModalOpen(false);
              clearState();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={handleSubmit}
            className="bg-[#0577fb] text-white border-white border-solid border-[1px]"
          >
            Schedule
          </Button>,
        ]}
        title={"Schedule New Class"}
      >
        <div className="flex items-center flex-col  justify-center w-full">
          <div className="flex flex-col items-center">
            <div className="w-[85vw] max-w-[450px] my-2 flex flex-row justify-left">
              <Checkbox onChange={onRepeatingChange}>
                Is Schedule Repeating?
              </Checkbox>
            </div>
            <p className="text-left font-[Poppins] font-[500] text-[12px] mt-2 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
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
              size="large"
              placeholder="Select Class"
              className="w-[85vw] max-w-[450px]"
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
                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-6 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
                  Subject
                </p>
                <AntSelect
                  value={selectedSubject || undefined}
                  onChange={handleSubjectChange}
                  placeholder="Select Subject"
                  className="w-[85vw] max-w-[450px]"
                  size="large"
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
                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
                  Batch
                </p>
                <AntSelect
                  value={selectedBatch || undefined}
                  onChange={handleBatchChange}
                  placeholder="Select Lab Batch"
                  className="w-[85vw] max-w-[450px]"
                  size="large"
                >
                  {batchOptions.map((option) => (
                    <AntSelect.Option key={option.value} value={option.value}>
                      {option.label}
                    </AntSelect.Option>
                  ))}
                </AntSelect>
              </>
            )}

            <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
              Faculty
            </p>
            <AntSelect
              mode="multiple"
              value={subjectFaculty}
              placeholder="Select faculties"
              className="w-[85vw] max-w-[450px]"
              size="large"
              onChange={(value) => setSubjectFaculty(value)}
            >
              {subjectFaculty.map((faculty) => (
                <AntSelect.Option key={faculty} value={faculty}>
                  {faculty}
                </AntSelect.Option>
              ))}
            </AntSelect>

            {isScheduleRepeating ? (
              <>
                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
                  Select Date Range
                </p>
                <RangePicker
                  defaultValue={[dayjs(), dayjs()]}
                  className="w-[85vw] max-w-[450px]"
                  inputReadOnly
                  size="large"
                  format="ddd, MMM D"
                  onChange={handleDateChange}
                  value={[repeatingStartDate, repeatingEndDate]}
                />

                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
                  Select Day
                </p>
                <AntSelect
                  placeholder="Select a day"
                  className="w-[85vw] max-w-[450px]"
                  size="large"
                  onChange={handleWeekDayChange}
                >
                  {daysOfWeek.map((day) => (
                    <AntSelect.Option key={day} value={day}>
                      {day}
                    </AntSelect.Option>
                  ))}
                </AntSelect>
              </>
            ) : (
              <>
                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
                  Date
                </p>
                <DatePicker
                  defaultValue={dayjs()}
                  className="w-[85vw] max-w-[450px]"
                  inputReadOnly
                  size="large"
                  format="ddd, MMM D"
                  onChange={setSelectedDate}
                  value={selectedDate || undefined}
                  placeholder="Select Date"
                  disabledDate={(current) =>
                    current && current < dayjs().subtract(1, "day")
                  }
                />
              </>
            )}

            <div className="flex flex-row justify-between   w-full ">
              <div className="w-full">
                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 ">
                  Start Time
                </p>
                <AntSelect
                  value={startTime || undefined}
                  onChange={handleStartTimeChange}
                  placeholder="Select Start Time"
                  className="w-11/12 mr-[8%]"
                  size="large"
                >
                  {timeOptions.map((option) => (
                    <AntSelect.Option key={option.value} value={option.value}>
                      {option.label}
                    </AntSelect.Option>
                  ))}
                </AntSelect>
              </div>

              <div className="w-full">
                <p className="text-left ml-[8%] font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 ">
                  End Time
                </p>
                <AntSelect
                  value={endTime || undefined}
                  onChange={(value) => setEndTime(value)}
                  placeholder="Select End Time"
                  className="w-11/12 ml-[8%]"
                  size="large"
                >
                  {timeOptions.map((option) => (
                    <AntSelect.Option key={option.value} value={option.value}>
                      {option.label}
                    </AntSelect.Option>
                  ))}
                </AntSelect>
              </div>
            </div>

            {!isScheduleRepeating && (
              <>
                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
                  Topic of Class
                </p>
                <Input
                  placeholder="Enter Topic of Class (optional)"
                  onChange={(e) => setClassTopic(e.target.value)}
                  size="large"
                  className="w-[85vw] max-w-[450px]"
                />
                <p className="text-left font-[Poppins] font-[500] text-[12px] mt-5 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
                  Class Description
                </p>
                <TextArea
                  placeholder="Enter Class Description or any Instructions if necessary (optional)"
                  onChange={(e) => setClassDescription(e.target.value)}
                  className="mb-4"
                  size="large"
                  style={{
                    width: "85vw",
                    maxWidth: "450px",
                  }}
                />
              </>
            )}
            {error && (
              <div className="bg-red-100 w-full text-red-500 rounded-lg mx-4  mb-2 font-[Poppins] p-2 ">
                {error}
              </div>
            )}
          </div>
        </div>
      </AntdModal>
      {contextHolder}
    </>
  );
};

export default ScheduleDashboard;
