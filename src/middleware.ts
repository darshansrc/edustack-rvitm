import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { db } from "@/lib/firebase-config";
import { customInitApp } from "@/lib/firebase-admin-config";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "firebase-admin";

customInitApp();

export async function middleware(request: NextRequest, response: NextResponse) {
  let userType: string = "";

  const session = cookies().get("session")?.value || "";

  const decodedClaims = await auth().verifySessionCookie(session, true);

  if (!decodedClaims) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const userUID = decodedClaims.uid;
  const getRef = doc(db, "users", userUID);
  const userDoc = await getDoc(getRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    userType = userData.type;
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/" && !session) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (pathname === "/" && session) {
    if (userType === "student") {
      return NextResponse.redirect(new URL("/student/home", request.url));
    } else if (userType === "faculty") {
      return NextResponse.redirect(new URL("/faculty/home", request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/student") || pathname.startsWith("/faculty")) {
    if (!session) {
      return NextResponse.rewrite(new URL("/auth/signin", request.url));
    }

    if (
      (userType === "student" && pathname.startsWith("/student")) ||
      (userType === "faculty" && pathname.startsWith("/faculty"))
    ) {
      // Allow access.
    } else {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  } else {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}
