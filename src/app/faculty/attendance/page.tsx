
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div style={{marginTop: '150px'}}>
        <Link href='faculty/attendance/attendance-form'  shallow={true}>
            Mark Attendance
        </Link>
    </div>
  )
}

export default page