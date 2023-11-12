import type { Metadata } from 'next';
import './globals.css';

import { StudentContextProvider } from './context/StudentContext';


export const metadata: Metadata = {
  title: 'EduStack',
  description: '',
  manifest: '/manifest.json',
  icons: {apple: '/logo.png'},
  viewport: "width=device-width, height=device-height,  initial-scale=1.0, user-scalable=no, user-scalable=0,  maximum-scale=1",
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body>
      <StudentContextProvider>
          {children}
        </StudentContextProvider>
     
      </body>
    </html>
  )
}
