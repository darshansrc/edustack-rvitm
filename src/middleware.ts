import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

async function redirectToSignIn(request: NextRequest) {
  // Delete the session cookie
  request.cookies.delete("session");
  return NextResponse.redirect(new URL("/auth/signin", request.url));
}

async function redirectToHome(request: NextRequest, userType: string) {
  const homePath = userType === "student" ? "/student/home" : "/faculty/home";
  return NextResponse.redirect(new URL(homePath, request.url));
}

export async function middleware(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/signin"];
  if (publicRoutes.includes(pathname)) {
    // If the user is already authenticated, redirect to home
    if (session) {
      try {
        const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
          headers: { Cookie: `session=${session?.value}` },
        });

        if (responseAPI.status === 200) {
          const { userType } = await responseAPI.json();
          return redirectToHome(request, userType);
        }
      } catch (error) {
        console.error("Error checking authentication API:", error);
        // Delete the session cookie on API error
        response.cookies.delete("session");
      }
    }

    // Continue to public routes
    return NextResponse.next();
  }

  // Protected routes that require authentication
  if (!session) {
    // Redirect to signin if no session exists
    return redirectToSignIn(request);
  }

  try {
    const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
      headers: { Cookie: `session=${session?.value}` },
    });

    if (responseAPI.status === 200) {
      const { userType } = await responseAPI.json();

      // Allow access if the user type matches the route
      if (
        (userType === "student" && pathname.startsWith("/student")) ||
        (userType === "faculty" && pathname.startsWith("/faculty"))
      ) {
        // Continue to the protected route
        return NextResponse.next();
      } else {
        // Redirect to home if the user type and route do not match
        return redirectToHome(request, userType);
      }
    } else {
      // Delete the session cookie on failed authentication
      response.cookies.delete("session");
    }
  } catch (error) {
    console.error("Error checking authentication API:", error);
    // Delete the session cookie on API error
    response.cookies.delete("session");
  }

  // Redirect to signin if authentication fails
  return redirectToSignIn(request);
}
