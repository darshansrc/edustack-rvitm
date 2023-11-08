'use client'

import React, { useEffect } from 'react'

const FetchData = () => {
    

useEffect(() => {
    async function fetchAttendanceData() {
        try {
        
          const responseAPI = await fetch(`${window.location.origin}/api/student/attendance`, {
            method: 'GET',
          });
          if (responseAPI.status === 200) {
            const responseBody = await responseAPI.json();
            console.log(responseBody)
  
  
          } else {
            console.log('Cannot fetch data');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
  
      fetchAttendanceData();

    }, [])

  return (
    <div>FetchData</div>
  )
}

export default FetchData