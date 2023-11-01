import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "./lib/firebase-config";



export async function middleware(request, response) {
    const session = request.cookies.get("session");
  
    if (request.nextUrl.pathname === '/') {
      if (session) {
        const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
          headers: {
            Cookie: `session=${session?.value}`,
          },
        });
  
        if (responseAPI.status === 200) {
          const responseBody = await responseAPI.json();
          const userUID = responseBody.userUID;
  
          const getRef = doc(db, 'users', userUID);
          const userDoc = await getDoc(getRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
  
            if (userData.type === 'student') {
              return NextResponse.redirect(new URL('/student/home', request.url));
            } else if (userData.type === 'faculty') {
              return NextResponse.redirect(new URL('/faculty/home', request.url));
            }
          } else {
            return NextResponse.redirect(new URL('/', request.url));
          }
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } else if (request.nextUrl.pathname.startsWith('/student') || request.nextUrl.pathname.startsWith('/faculty')) {
      if (!session) {
        return NextResponse.rewrite(new URL('/', request.url));
      }
  
      const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
        headers: {
          Cookie: `session=${session?.value}`,
        },
      });
  
      if (responseAPI.status === 200) {
        const responseBody = await responseAPI.json();
        const userUID = responseBody.userUID;
  
        const getRef = doc(db, 'users', userUID);
        const userDoc = await getDoc(getRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
  
          if (userData.type === 'student' && request.nextUrl.pathname.startsWith('/student')) {
            // Allow access.
          } else if (userData.type === 'faculty' && request.nextUrl.pathname.startsWith('/faculty')) {
            // Allow access.
          } else {
            return NextResponse.redirect(new URL('/', request.url));
          }
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  
    // Handle other cases here.
  }
  
