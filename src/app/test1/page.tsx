'use client';
import Link from 'next/link';
import React from 'react'

const page = () => {
  return (
    <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center',height: '100vh',width: '100vw'}}><Link href='/test'>Back Link</Link></div>
  )
}

export default page