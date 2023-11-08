import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function middleware(request : NextRequest, response : NextResponse) {


    const session = request.cookies.get("session");

    if (request.nextUrl.pathname === '/' && session) {

        const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
          headers: {
            Cookie: `session=${session?.value}`,
          },
        });
  
        if (responseAPI.status === 200) {
          const responseBody = await responseAPI.json();
          const userUID = responseBody.userUID;
          const userType = responseBody.userType;
          const userEmail = responseBody.userEmail;

          if (userType) {
  
            if (userType === 'student') {
              return NextResponse.redirect(new URL('/student/home', request.url));
            } else if (userType === 'faculty') {
              return NextResponse.redirect(new URL('/faculty/home', request.url));
            }
          } else {
            return NextResponse.redirect(new URL('/', request.url));
          }
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      
    } 
    
    if (request.nextUrl.pathname.startsWith('/student') || request.nextUrl.pathname.startsWith('/faculty')) {
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
        const userType = responseBody.userType;

        if (userType) {
          if (userType === 'student' && request.nextUrl.pathname.startsWith('/student')) {
            // Allow access.
          } else if (userType === 'faculty' && request.nextUrl.pathname.startsWith('/faculty')) {
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
  
