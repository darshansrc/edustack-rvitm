import { NextResponse } from "next/server";

async function checkAuthentication(request, response) {
  const session = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  try {
    const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
      headers: { Cookie: `session=${session?.value}` },
    });

    if (responseAPI.status === 200) {
      const { userType } = await responseAPI.json();

      if (!session) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }

      if (
        (userType === "faculty" && pathname.startsWith("/faculty")) ||
        (userType === "student" && pathname.startsWith("/student"))
      ) {
        // Continue to the protected route
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      handleFailedAuthentication(request, response, session);
    }
  } catch (error) {
    console.error("Error checking authentication API:", error);
    handleFailedAuthentication(request, response, session);
  }

  // Continue to the next middleware or route handler
  return NextResponse.next();
}

function handleFailedAuthentication(request, response, session) {
  // Delete the session cookie on failed authentication
  if (response.cookies && session) {
    response.cookies.delete("session");
    console.log("Session cookie deleted  middleware!");
  }
  return NextResponse.redirect(new URL("/auth/signin", request.url));
}

export async function middleware(request, response) {
  return checkAuthentication(request, response);
}
