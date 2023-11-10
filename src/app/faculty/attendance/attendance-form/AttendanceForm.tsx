'use client'
import React, { useState } from 'react'


const AttendanceForm = () => {


    const [ formStep , setFormStep ] = useState<number>(1);


    const stepOne = () => {
        return (
            <div>
                <h1>Step One</h1>
                <button onClick={() => setFormStep(2)}>Next</button>
            </div>
        )
    }

    const stepTwo = () => {
        return (
            <div>
                <h1>Step Two</h1>
                <button onClick={() => setFormStep(3)}>Next</button>
            </div>
        )
    }

    const stepThree = () => {
        return (
            <div>
                <h1>Step Three</h1>
                <button onClick={() => setFormStep(1)}>Back to Home</button>
            </div>
        )
    }


  return (
    <div className='flex items-center justify-center flex-col w-[100vw] h-[100vh]'>
        <div className='w-[95vw] max-w-[550px] bg-white rounded-md border border-solid border-slate-800 '>
        {formStep === 1 && stepOne()}
        {formStep === 2 && stepTwo()}
        {formStep === 3 && stepThree()}
        </div>

    </div>
  )
}

export default AttendanceForm