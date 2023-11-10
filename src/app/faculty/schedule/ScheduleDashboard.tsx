import React, { useState, useEffect } from 'react';
import styles from './ScheduleDashboard.module.css';
import { IoChevronBackSharp, IoChevronForwardSharp } from 'react-icons/io5';
import { Modal, ModalClose, ModalDialog } from '@mui/joy';
import NewSchedule from './NewSchedule';


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

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const renderScheduleTimeline = () => {
    // Filter events for the selected date
    const selectedDateEvents = scheduleData?.queryResult
        .filter((event) => new Date(event.date).toDateString() === selectedDate.toDateString())
        .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
  
    if (!selectedDateEvents || selectedDateEvents.length === 0) {
      return <div className={styles.noClassContainer}>No classes scheduled for this day.</div>;
    }
  
    return (
      <div className="space-y-4">
        {selectedDateEvents.map((event, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <div className="text-blue-500 font-bold mr-2">{formatTime(event.startTime)} {' - '} </div>
              <div className="text-gray-500">{formatTime(event.endTime)}</div>
            </div>
            <div className="text-lg font-semibold mb-2">{event.subjectName}</div>
            <div className="text-gray-700 mb-2">{event.selectedClassName}</div>
            <div className="text-gray-500">
              {formatDate(event.date)} | {event.faculty.join(', ')}
            </div>
            {/* Add more details as needed */}
          </div>
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
