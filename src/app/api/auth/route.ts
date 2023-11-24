import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-config";

customInitApp();

export async function GET(request: NextRequest) {
  const session = cookies().get("session")?.value || "";
  //Validate if the cookie exist in the request
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  try {
    const decodedClaims = await auth().verifySessionCookie(session, true);

    if (!decodedClaims) {
      return NextResponse.json({ isLogged: false }, { status: 401 });
    }
    let userType;
    const userUID = decodedClaims.uid; // Get the user's UID
    const userEmail = decodedClaims.email; // Get the user's email
    const getRef = doc(db, "users", userUID);
    const userDoc = await getDoc(getRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      userType = userData.type;
    }

    return NextResponse.json(
      { isLogged: true, userUID, userEmail, userType },
      { status: 200 }
    );
  } catch (e) {
    cookies().delete("session");
    console.log(e);
    console.log("Session cookie is invalid !");
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  //Use Firebase Admin to validate the session cookie
}

export async function POST(request: NextRequest, response: NextResponse) {
  const authorization = headers().get("Authorization");

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    const decodedToken = await auth().verifyIdToken(idToken);

    if (decodedToken) {
      //Generate session cookie
      const expiresIn = 300000;
      const sessionCookie = await auth().createSessionCookie(idToken, {
        expiresIn,
      });
      const options = {
        name: "session",
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      //Add the cookie to the browser
      cookies().set(options);
    }
  }

  return NextResponse.json({}, { status: 200 });
}
