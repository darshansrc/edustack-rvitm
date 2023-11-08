import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  UserCredential,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase-config";

interface UserAuthContextType {
  user: User | null;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

const userAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function logIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth", currentUser);
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider value={{ user, logIn, signUp, logOut }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(userAuthContext);

  return context;
}
