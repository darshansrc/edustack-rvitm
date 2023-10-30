import getUser from '@/lib/getUser'
import React from 'react'

async function App() {
  const user = await getUser()

  const formattedString = JSON.stringify(user, null, "\t");

  return (
    <div className='mx-auto max-w-4xl my-32 '>
      <h1 className='text-3xl mb-8'>You are now in protected area of the app</h1>
      <p className='mb-4 font-light text-xl'>Here is your information:</p>
      <div className="relative bg-gray-800 p-4 rounded-md shadow-md overflow-x-auto">
        <pre  className="text-sm text-white font-mono">
          <code>{formattedString}</code>
        </pre>
  
      </div>

    </div>
  )
}

export default App