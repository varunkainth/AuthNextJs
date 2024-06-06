"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const getuserDetails = async () => {
    const res = await axios.get("/api/v1/users/profile");
    console.log(res.data.data._id);
    setData(res.data.data._id);
  };

  const logout = async () => {
    try {
      await axios.get("/api/v1/users/logout");
      toast.success("logout Success");
      router.push("/login");
    } catch (error: any) {
      console.log(error);
      toast.error(error.messgae);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>ProfilePage</h1>
      <hr />
      <h2>
        {data === "nothing" ? (
          "No data for display"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <button
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 rounded"
        type="submit"
        onClick={getuserDetails}
      >
        Get User Details
      </button>
      <button
        className="bg-red-500 mt-4 hover:bg-red-700 text-white font-bold py-2 rounded"
        type="submit"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
