"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const verifyUserEmail = async () => {
    setLoading(true);
    try {
      await axios.post("/api/v1/users/verifyemail", { token });
      setVerified(true);
      setError(false);
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  // useEffect(() => {
  //   if (token.length > 0) {
  //     verifyUserEmail();
  //   }
  // }, [token]);

  useEffect(() => {
    if (verified) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 5000);
      return () => clearTimeout(timer); // Clear timeout if the component is unmounted
    }
  }, [verified, router]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl">Verify Email</h1>
        <h2 className="p-2 bg-orange-400 text-black">
          {token ? `${token}` : "No Token"}
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <button
            onClick={verifyUserEmail}
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Verify Email
          </button>
        )}
        {verified && (
          <div>
            <h2>Verified</h2>
            <p>Redirecting to login page in 5 seconds...</p>
            <p>if not kindly click on the login....</p>
            <Link href="/login">Login</Link>
          </div>
        )}
        {error && (
          <div>
            <h2>Error verifying email. Please try again.</h2>
          </div>
        )}
      </div>
    </>
  );
}
