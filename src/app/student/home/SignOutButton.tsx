'use client';
import { auth } from '@/lib/firebase-config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React from 'react'

const SignOutButton = () => {

  const router = useRouter();

  const handleSignOut = async () => {
    signOut(auth);
    const response = await fetch(`${window.location.origin}/api/signout`, {
        method: "POST",
      });
      if (response.status === 200) {
        router.push("/");
      }
    }
  
  return (
    <button onClick={() => handleSignOut()}>Logout</button>
  )
}

export default SignOutButton