import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  if (pathname === "/" && !session) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (pathname === "/" && session) {
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
        } else if (userType === "parent") {
          return NextResponse.redirect(new URL("/parent/home", request.url));
        }
      } else {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
    } catch (error) {
      console.error("Error checking authentication API:", error);
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  if (
    pathname.startsWith("/student") ||
    pathname.startsWith("/faculty") ||
    pathname.startsWith("/parent")
  ) {
    if (!session) {
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
          (userType === "faculty" && pathname.startsWith("/faculty")) ||
          (userType === "parent" && pathname.startsWith("/parent"))
        ) {
          // Continue to the protected route
        } else {
          return NextResponse.redirect(new URL("/auth/signin", request.url));
        }
      } else {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
    } catch (error) {
      console.error("Error checking authentication API backward:", error);

      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  if (pathname === "/auth/signin" && session) {
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
        } else if (userType === "parent") {
          return NextResponse.redirect(new URL("/parent/home", request.url));
        }
      }
    } catch (error) {
      console.error("Error checking authentication API at /auth/signin", error);
    }
  }

  // Continue to the next middleware or route handler
  return NextResponse.next();
}
