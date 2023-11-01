import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "./lib/firebase-config";

async function fetchUserData(userUID : string) {
  const getRef = doc(db, 'users', userUID);
  return await getDoc(getRef);
}

export async function middleware(request : any, response : any) {
  const session = request.cookies.get("session");
  const isRootPath = request.nextUrl.pathname === '/';
  const isStudentPath = request.nextUrl.pathname.startsWith('/student');
  const isFacultyPath = request.nextUrl.pathname.startsWith('/faculty');

  if (isRootPath) {
    if (session) {
      const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
        headers: {
          Cookie: `session=${session?.value}`,
        },
      });

      if (responseAPI.status === 200) {
        const responseBody = await responseAPI.json();
        const userUID = responseBody.userUID;
        const userDoc = await fetchUserData(userUID);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.type === 'student') {
            return NextResponse.redirect(new URL('/student/home', request.url));
          } else if (userData.type === 'faculty') {
            return NextResponse.redirect(new URL('/faculty/home', request.url));
          }
        }
      }
    }
    return NextResponse.redirect(new URL('/', request.url));
  } else if ((isStudentPath || isFacultyPath) && !session) {
    return NextResponse.rewrite(new URL('/', request.url));
  } else if ((isStudentPath || isFacultyPath) && session) {
    const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
      headers: {
        Cookie: `session=${session?.value}`,
      },
    });

    if (responseAPI.status === 200) {
      const responseBody = await responseAPI.json();
      const userUID = responseBody.userUID;
      const userDoc = await fetchUserData(userUID);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if ((userData.type === 'student' && isStudentPath) || (userData.type === 'faculty' && isFacultyPath)) {
          // Allow access.
          return;
        }
      }
    }
    return NextResponse.redirect(new URL('/', request.url));
  }
}
