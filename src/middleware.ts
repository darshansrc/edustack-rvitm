import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-config";

customInitApp();

async function authenticateUser(request: NextRequest) {
  let userType: string = "";
  const session = cookies().get("session")?.value || "";

  if (!session) {
    return { isLogged: false, status: 401 };
  }

  try {
    const decodedClaims = await auth().verifySessionCookie(session, true);

    if (!decodedClaims) {
      return { isLogged: false, status: 401 };
    }

    const userUID = decodedClaims.uid;
    const userEmail = decodedClaims.email;
    const getRef = doc(db, "users", userUID);
    const userDoc = await getDoc(getRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      userType = userData.type;
    } else {
      return { isLogged: false, status: 404 };
    }

    return { isLogged: true, userUID, userEmail, userType, status: 200 };
  } catch (error) {
    console.error("Error during user authentication:", error);
    return { isLogged: false, status: 500 };
  }
}

export async function middleware(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/faculty")
  ) {
    const authResult = await authenticateUser(request);

    if (!authResult.isLogged) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // Additional logic based on user type or other checks can be added here

    if (pathname === "/" && authResult.userType === "student") {
      return NextResponse.redirect(new URL("/student/home", request.url));
    } else if (pathname === "/" && authResult.userType === "faculty") {
      return NextResponse.redirect(new URL("/faculty/home", request.url));
    } else if (
      (pathname.startsWith("/student") && authResult.userType === "student") ||
      (pathname.startsWith("/faculty") && authResult.userType === "faculty")
    ) {
      // Allow access.
    } else {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }
}
