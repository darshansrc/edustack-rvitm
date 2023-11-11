import React, { useState, useEffect } from 'react';
import styles from './ScheduleDashboard.module.css';
import { IoChevronBackSharp, IoChevronForwardSharp } from 'react-icons/io5';
import { Modal, ModalClose, ModalDialog } from '@mui/joy';
import NewSchedule from './NewSchedule';
import { Timeline } from "keep-react";
import { ArrowRight, CalendarBlank } from "phosphor-react";


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

  const handlescheduleModalOpen = () => {
    setScheduleClassModalOpen(true);
  }


  const NewScheduleModal = () => {
    return (
      <Modal open={scheduleClassModalOpen} onClose={() => setScheduleClassModalOpen(false)} >
          <ModalDialog>
            <ModalClose onClick={() => setScheduleClassModalOpen(false)} />
 
             <NewSchedule/>

          </ModalDialog>
      </Modal>
    )
  }

  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/faculty/schedule`);
        const data: ScheduleData = await response.json();
        setScheduleData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderScheduleTimeline = () => {
    // Filter events for the selected date
    const selectedDateEvents = scheduleData?.queryResult.filter(
      (event) => new Date(event.date).toDateString() === selectedDate.toDateString()
    );

    if (!selectedDateEvents || selectedDateEvents.length === 0) {
      return <div className={styles.noClassContainer}>No classes scheduled for this day.</div>;
    }


    
    const formatTime = (date) => {
      date = new Date(date);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    };
    


    return (
        <div className="flex flex-col w-[95vw] max-w-[550px] my-8 px-6">
        {selectedDateEvents.map((event, index) => (

            <><Timeline  key={index} timelineBarType="dashed" gradientPoint={true}>
                <Timeline.Item>
                    <Timeline.Point icon={<CalendarBlank  size={16} />} />
                    <Timeline.Content>
                        <Timeline.Time>{formatTime(event.startTime)} - {formatTime(event.endTime)}</Timeline.Time>

                        <div className='border border-dashed border-slate-600 rounded bg-white flex flex-col justify-center'>
                        <div>{event.subjectName}</div>
                        <div>
                        {event.selectedClassName}
                        </div>
                        </div>


                    </Timeline.Content>
                </Timeline.Item>
            </Timeline>
            
         </>
        ))}
      </div>
    );
  };


  

  return (
    <>
    <div className={styles.scheduleContainer}>
      <div className={styles.schedulePage}>

      <button className='bg-blue-600 w-11/12 text-white rounded-lg mx-4 mt-12 mb-4 font-[Poppins] p-2 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300'
      onClick={() => setScheduleClassModalOpen(true)}>
            Schedule New Class
        </button>

        <div>
          <div className={styles.selectedDateBar}>

            
            <div className={styles.selectedDate}>
              {selectedDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div
              onClick={() => formattedDate === selectedDateDate ? null : handleTodayClick()}
              className={formattedDate === selectedDateDate ? styles.todayButtonDisabled : styles.todayButton}
              style={{ padding: '5px 10px', marginRight: '15px' }}
            >
              Today
            </div>
          </div>
          <div className={styles.dateGrid}>
            <div onClick={() => handleWeekChange(-1)} className={styles.button}>
              <IoChevronBackSharp />
            </div>
            {currentWeekDates.map((date, index) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const todayDate = date.toDateString() === formattedDate;
              return (
                <div className={styles.dateContainer} key={index}>
                  <span
                    onClick={() => handleDateClick(date)}
                    className={`${styles.date} ${isSelected ? styles.selectedDateDiv : todayDate ? styles.currentDateDiv : ''}`}
                  >
                    {date.getDate()}
                    <div className={styles.day}>{date.toLocaleString('en-US', { weekday: 'short' })}</div>
                  </span>
                </div>
              );
            })}
            <div onClick={() => handleWeekChange(1)} className={styles.button}>
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
