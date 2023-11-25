"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/faculty/schedule/ScheduleDashboard.module.css";
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
import { auth, db } from "@/lib/firebase-config";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { collection, getDocs } from "firebase/firestore";
import { get } from "http";

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
  const [studentDetails, setStudentDetails] = useState<any>({});

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const currentServerDomain = window.location.origin;
        const responseAPI = await fetch(
          `${currentServerDomain}/api/student/home`,
          {
            method: "GET",
          }
        );

        if (responseAPI.status === 200) {
          const responseBody = await responseAPI.json();
          setStudentDetails(responseBody.studentDetails);
        } else {
          console.log("Cannot fetch data");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchAttendanceData();
  }, []);

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
        console.log(studentDetails.className);
        const scheduleRef = collection(
          db,
          "database",
          studentDetails.className,
          "classSchedule"
        );
        const scheduleSnapshot = await getDocs(scheduleRef);
        let queryResult: any[] = [];

        await Promise.all(
          scheduleSnapshot.docs.map(async (facultyDoc) => {
            console.log(facultyDoc.data());
            queryResult.push(facultyDoc.data());
          })
        );

        setScheduleData({ queryResult });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentDetails]);

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
                      Topic:{" "}
                    </span>
                    {event?.classTopic ? event?.classTopic : "N/A"}
                  </div>
                  <div className="text-slate-500 font-[Poppins] text-[12px]">
                    <span className="text-[#0577fb] font-[Poppins] text-[12px]  ">
                      Faculty:{" "}
                    </span>
                    {event?.faculty ? event?.faculty : "N/A"}
                  </div>
                  {event.classDescription && (
                    <div className="text-slate-500 font-[Poppins] text-[12px]">
                      <span className="text-[#0577fb] font-[Poppins] text-[12px]  ">
                        Description:{" "}
                      </span>
                      {event?.classDescription}
                    </div>
                  )}
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
    </>
  );
};

export default ScheduleDashboard;
