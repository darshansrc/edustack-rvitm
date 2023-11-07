'use client';
import React, { useState, useEffect } from 'react';
import styles from './ClassSchedule.module.css';
import { IoChevronBackSharp, IoChevronForwardSharp } from 'react-icons/io5';

const ClassSchedule: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekDates, setCurrentWeekDates] = useState<Date[]>([]);

const initializeCurrentWeek = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the current week
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

  const handleMonthChange = (change: number) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(selectedMonth.getMonth() + change);
    setSelectedMonth(newMonth);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };


  const handleWeekChange = (change: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7 * change);
    setSelectedDate(newDate);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date()); // Set selectedDate to the current date
  };

  const todayDate = new Date();
  const formattedDate = todayDate.toDateString();
  const selectedDateDate = selectedDate.toDateString();


  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.schedulePage}>
        <div>
          <div className={styles.selectedDateBar}>


            <div className={styles.selectedDate} >
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
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={`${styles.date} ${
                      isSelected ? styles.selectedDateDiv : 
                        todayDate ? styles.currentDateDiv : ''
                      }`} 
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


      <div className={styles.noClassContainer}>
        No classes scheduled for this day.
      </div>
    </div>
  );
};

export default ClassSchedule;


