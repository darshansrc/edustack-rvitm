import React from 'react'
import  AttendanceTable  from './AttendanceTable'
import TopNavbar from '@/app/student/components/topnavbar/TopNavbar'
import BottomNavbar from '../../components/bottomNavbar/BottomNavbar'
import DesktopNavbar from '../../components/DesktopNavBar/DesktopNavbar'

const page = () => {
  return (
    <>
    <TopNavbar name='Export Attendance'/>
    <AttendanceTable/>
    <BottomNavbar/>
    {/* <DesktopNavbar/> */}
    </>
  )
}

export default page

            {/* <table className='min-w-full bg-white border border-gray-200'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>USN</th>
                  <th>Classes Held</th>
                  <th>Classes Attended</th>
                  <th>Attendance Percentage</th>
                  {attendanceData.map((data: any) => (
                    <th
                      key={data.classStartTime}
                    >
                      {new Date(data.classDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mergedAttendanceData.map((student, index) => (
                  <tr key={student.usn} className="{{ index % 2 === 0 ? 'bg-gray-50' : 'bg-white' }}">
                    <td>{student.name}</td>
                    <td>{student.usn}</td>
                    <td>{getClassCount()}</td>
                    <td>{getAttendanceCount(student.usn)}</td>
                    <td>
                      {getAttendancePercentage(
                        getAttendanceCount(student.usn),
                        getClassCount()
                      )}
                      %
                    </td>
                    {attendanceData.map((data) => (
                      <td
                        key={`${data.classStartTime}-${student.usn}`}
                      >
                        {student.attendance[data.classStartTime] !== undefined ? (
                          student.attendance[data.classStartTime] ? (
                            <span>P</span>
                          ) : (
                            <span>A</span>
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table> */}