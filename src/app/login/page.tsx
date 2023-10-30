'use client';
import { getRedirectResult, signInWithRedirect, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "@/lib/firebase-config";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getRedirectResult(auth).then(async (userCred) => {
      if (!userCred) {
        return;
      }

      setIsLoading(true);

      fetch("/api/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await userCred.user.getIdToken()}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          router.push("/app");
        }
        setIsLoading(false);
      });
    });
  }, []);

  async function signInWithGoogle() {
    setIsLoading(true);

    signInWithRedirect(auth, provider).catch((error) => {
      console.error("Error signing in with Google:", error);
      setIsLoading(false);
    });
  }

  async function signInWithEmailAndPasswordHandler() {
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password).then(async (userCred) => {
        if (!userCred) {
          return;
        }

        fetch("/api/auth", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await userCred.user.getIdToken()}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            router.push("/app");
          }
          setIsLoading(false);
        });
      });
      // You can also add a redirect or state change here as needed.
    } catch (error) {
      console.error("Error signing in with email and password:", error);
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-3xl uppercase mb-8">Login page</h2>
      <button className="p-4 rounded-lg bg-green-200" onClick={() => signInWithGoogle()} disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In With Google"}
      </button>

      <div>
        <h3>Sign In With Email and Password:</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="p-4 rounded-lg bg-blue-200" onClick={() => signInWithEmailAndPasswordHandler()} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </>
  );
}
