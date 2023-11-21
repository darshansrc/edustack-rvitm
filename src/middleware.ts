// middleware.ts
import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-config";

customInitApp();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Authentication logic
  const session = request.cookies.get("session")?.value || "";

  if (
    !session &&
    (pathname.startsWith("/faculty") || pathname.startsWith("/student"))
  ) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    const decodedClaims = await auth().verifySessionCookie(session, true);

    if (
      !decodedClaims &&
      (pathname.startsWith("/faculty") || pathname.startsWith("/student"))
    ) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const userUID = decodedClaims.uid;
    const getRef = doc(db, "users", userUID);
    const userDoc = await getDoc(getRef);

    if (!userDoc.exists()) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const userData = userDoc.data();
    const userType = userData.type;

    // Authorization logic based on user type
    if (userType === "faculty" && pathname.startsWith("/faculty")) {
      // Allow access to faculty routes
      return NextResponse.next();
    } else if (userType === "student" && pathname.startsWith("/student")) {
      // Allow access to student routes
      return NextResponse.next();
    } else {
      // Redirect to sign-in if user type and route do not match
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  } catch (error) {
    console.error("Error during user authentication:", error);
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}
