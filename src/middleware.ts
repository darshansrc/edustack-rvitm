import { signOut } from "firebase/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./lib/firebase-config";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  if (pathname === "/" && !session) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if ((pathname === "/" || pathname === "/auth/signin") && session) {
    try {
      const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
        headers: { Cookie: `session=${session?.value}` },
      });

      if (responseAPI.status === 200) {
        const { userType } = await responseAPI.json();

        if (userType === "student") {
          return NextResponse.redirect(new URL("/student/home", request.url));
        } else if (userType === "faculty") {
          return NextResponse.redirect(new URL("/faculty/home", request.url));
        }
      } else {
        // Delete the session cookie on failed authentication
        cookies().delete("session");
        console.log("Session cookie cleared 25");
        if (response.cookies && session) {
          response.cookies.delete("session");
        }
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error checking authentication API:", error);

      cookies().delete("session");
      console.log("Session cookie cleared 250");

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/student") || pathname.startsWith("/faculty")) {
    if (
      !session &&
      (pathname.startsWith("/student") || pathname.startsWith("/faculty"))
    ) {
      console.log("Session cookie cleared 3334");
      return NextResponse.rewrite(new URL("/auth/signin", request.url));
    }

    try {
      const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
        headers: { Cookie: `session=${session?.value}` },
      });

      if (responseAPI.status === 200) {
        const { userType } = await responseAPI.json();

        if (
          (userType === "student" && pathname.startsWith("/student")) ||
          (userType === "faculty" && pathname.startsWith("/faculty"))
        ) {
          // Continue to the protected route
        } else {
          cookies().delete("session");
          console.log("Session cookie cleared 33399");
          return NextResponse.redirect(new URL("/auth/signin", request.url));
        }
      } else {
        cookies().delete("session");
        console.log("Session cookie cleared 333567");
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
    } catch (error) {
      console.error("Error checking authentication API:", error);

      cookies().delete("session");
      console.log("Session cookie cleared 33356789");

      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Continue to the next middleware or route handler
  return NextResponse.next();
}
