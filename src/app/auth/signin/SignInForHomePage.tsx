"use client";
import Link from "next/link";
import styles from "./SignInForHomePage.module.css";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db, provider } from "@/lib/firebase-config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { Alert, Button, Input } from "antd";
import LogoAnimation from "@/app/HomePageComponents/RightSideOfPage/LogoAnimation/LogoAnimation";
import { motion } from "framer-motion";

const SignInForHomePage = (props) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      await googleSignIn().then(async (res) => {
        const user = res.user;
        const getRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(getRef);

        const idToken = await user.getIdToken();
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!userDoc.exists()) {
          try {
            setError(
              "No Records Found, Please activate your account before logging in with google!"
            );
            console.log("here");
            await user.delete();
          } catch (err) {
            console.log("could not delete!");
            await user.delete();
          }
        }

        if (response.status === 200) {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.type === "student") {
              router.push("/student/home");
            } else if (userData.type === "faculty") {
              router.push("/faculty/home");
            } else if (userData.type === "parent") {
              router.push("/parent/home");
            }
          }
        } else {
          setError(
            "No Records Found, Please activate your account before logging in with google!"
          );
        }
      });
    } catch (err) {
      setError(err.code);
    } finally {
      setLoading(false);
    }
  };

  const removeCookieSafely = (cookieName: string) => {
    // Check if the document is mounted
    if (typeof document !== "undefined") {
      // Remove the cookie
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    } else {
      console.warn("Document is not mounted. Cookie removal skipped.");
    }
  };
  const handleSubmit = async () => {
    try {
      removeCookieSafely("session");
      if (!email || !password) {
        setError("Please fill all the fields");
        return;
      }

      setIsLoading(true);

      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const getRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(getRef);

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (response.status === 200) {
        try {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.type === "student") {
              router.push("/student/home");
            } else if (userData.type === "faculty") {
              router.push("/faculty/home");
            } else {
              setError("No Records Found");
              await signOut(auth);
            }
          }
        } catch (err) {
          setError("Error processing user data");
          await signOut(auth);
        }
      } else {
        setError("Authentication failed");
        await signOut(auth);
      }
    } catch (error) {
      setError(error.code);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-[100vh]">
      <div className="relative flex flex-col items-center justify-center w-[95%] max-w-[450px]  bg-white rounded-lg border p-4 border-solid border-gray-50">
        {/* {props.showSide === "leftSide" && (
          <Button
            onClick={() => props.setShowSide("rightSide")}
            type="primary"
            className="absolute top-0 left-0 m-2"
          >
            Back
          </Button>
        )} Ant d button*/}
        {props.showSide === "leftSide" && (
          <button
            type="button"
            onClick={() => {
              if (window.matchMedia("(min-width: 768px)").matches) {
                props.setShowSide("bothSides");
              } else {
                props.setShowSide("rightSide");
              }
            }}
            className="absolute top-0 left-0 m-2 text-white bg-[#1677ff] hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 "
          >
            <svg
              className="w-4 h-4 transform rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
            <span className="sr-only"></span>
          </button>
        )}
        <h4 className="font-poppins flex flex-row  my-6 font-semibold  text-[24px] text-gray-800 mt-8">
          <div className="w-10 h-10 pr-4 mr-2 mt-[-150px]">
            <LogoAnimation scale={"0.25"} />
          </div>
          Edustack
        </h4>

        <h5 className="font-semibold pl-2 my-3 text-sm w-full text-left">
          Login as{" "}
          <motion.span
            key={props.loginType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-[#1677ff] transition-colors duration-200"
          >
            {props.loginType}
          </motion.span>
        </h5>

        <p className="font-poppins w-full text-left pl-2 text-[12px] text-gray-700 mt-3">
          College Mail
        </p>

        <Input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="large"
          className="font-poppins"
          prefix={<HiOutlineMail />}
        />

        <p className="font-poppins w-full mt-6 text-left pl-2 text-[12px] text-gray-700 ">
          Password
        </p>

        <Input.Password
          placeholder="Enter your password"
          type={passwordShown ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="large"
          className="font-poppins"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          prefix={<HiOutlineLockClosed />}
        />

        <div className="w-full text-left flex justify-start items-start pl-2 mt-2 text-blue-400 text-sm">
          <Link href="/auth/forgot-password">Forgot Password?</Link>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            className="w-full"
            showIcon
            style={{ marginTop: "10px" }}
          />
        )}

        <Button
          className="mt-4 w-full font-poppins"
          onClick={handleSubmit}
          type="primary"
          loading={isLoading}
          size="large"
        >
          Sign In
        </Button>
        <p
          style={{
            fontSize: "14px",
            marginTop: "15px",
            fontWeight: "500",
            color: "#333",
          }}
        >
          Account not activated?{" "}
          <Link href="/auth/activate-account" className="text-blue-400">
            Click here
          </Link>
        </p>
        <div className={styles.or}>
          <hr className={styles.bar} />
          <span className="mx-3">OR</span>
          <hr className={styles.bar} />
        </div>
        <button
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <>
              <Image
                width={60}
                height={60}
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Logo"
              />{" "}
              Loading...
            </>
          ) : (
            <>
              <Image
                width={60}
                height={60}
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Logo"
              />{" "}
              Continue with Google
            </>
          )}
        </button>
      </div>
    </main>
  );
};

export default SignInForHomePage;
