"use client";

import React, { useState, useEffect } from "react";
import styles from "./ScheduleDashboard.module.css";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import { Modal as AntdModal } from "antd";
import NewSchedule from "./NewSchedule";
import { Timeline } from "keep-react";
import { ArrowRight, CalendarBlank } from "phosphor-react";
import { TiDeleteOutline } from "react-icons/ti";

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
}

interface ScheduleData {
  queryResult: ScheduleEvent[];
}

const ScheduleDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekDates, setCurrentWeekDates] = useState<Date[]>([]);
  const [scheduleClassModalOpen, setScheduleClassModalOpen] = useState(false);

  // New Schedule

  const initializeCurrentWeek = () => {
    const currentDate = new Date(selectedDate);
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
  }, [selectedDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleWeekChange = (change: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7 * change);
    setSelectedDate(newDate);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  const todayDate = new Date();
  const formattedDate = todayDate.toDateString();
  const selectedDateDate = selectedDate.toDateString();

  const NewScheduleModal = () => {
    return (
      <AntdModal
        open={scheduleClassModalOpen}
        onCancel={() => setScheduleClassModalOpen(false)}
        onOk={() => setScheduleClassModalOpen(false)}
        footer={null}
      >
        <NewSchedule />
      </AntdModal>
    );
  };

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
              sessionToDelete?.endTime,
            // Include any other necessary data for identification
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete session: ${response.statusText}`);
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

  const renderScheduleTimeline = () => {
    // Filter events for the selected date
    const selectedDateEvents = scheduleData?.queryResult.filter(
      (event) =>
        new Date(event.date).toDateString() === selectedDate.toDateString()
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

    return (
      <div className="flex flex-col w-[95vw] max-w-[550px] my-8 px-6 relative">
        {selectedDateEvents.map((event, index) => (
          <Timeline key={index} timelineBarType="dashed" gradientPoint={true}>
            <Timeline.Item>
              <Timeline.Point icon={<CalendarBlank size={16} />} />
              <Timeline.Content>
                <Timeline.Time>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </Timeline.Time>

                <div className="border border-dashed border-slate-600 rounded bg-white flex flex-col justify-center p-[12px] mt-2 pr-[30px]">
                  <div className="text-slate-500 font-[Poppins] text-[12px] font-semibold">
                    <span className="text-blue-500 font-[Poppins] text-[12px]">
                      SUBJECT:{" "}
                    </span>
                    {event.subjectName}
                  </div>
                  <div className="text-slate-500 font-[Poppins] text-[12px]">
                    <span className="text-blue-500 font-[Poppins] text-[12px] font-semibold">
                      CLASS:{" "}
                    </span>
                    {event.selectedClassName}
                  </div>

                  {event.isLabSubject && (
                    <div className="text-slate-500 font-[Poppins] text-[12px]">
                      <span className="text-blue-500 font-[Poppins] text-[12px] font-semibold">
                        BATCH:{" "}
                      </span>
                      B-{event?.selectedBatch}
                    </div>
                  )}
                </div>

                {/* Delete button/icon */}
                <div className="top-[35%] right-3 absolute">
                  <TiDeleteOutline
                    size={20}
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteSession(index)}
                  />
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
      <div className={styles.scheduleContainer}>
        <div className={styles.schedulePage}>
          <button
            className="bg-blue-600 w-11/12 text-white rounded-lg mx-4 mt-12 mb-4 font-[Poppins] p-2 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => setScheduleClassModalOpen(true)}
          >
            Schedule New Class
          </button>

          <div>
            <div className={styles.selectedDateBar}>
              <div className={styles.selectedDate}>
                {selectedDate.toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div
                onClick={() =>
                  formattedDate === selectedDateDate ? null : handleTodayClick()
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
            <div className={styles.dateGrid}>
              <div
                onClick={() => handleWeekChange(-1)}
                className={styles.button}
              >
                <IoChevronBackSharp />
              </div>
              {currentWeekDates.map((date, index) => {
                const isSelected =
                  date.toDateString() === selectedDate.toDateString();
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

      <NewScheduleModal />
    </>
  );
};

export default ScheduleDashboard;
