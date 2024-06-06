"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: Boolean;
  isAdmin: Boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const getuserDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/users/profile");
      console.log(res.data.data);
      setUser(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/v1/users/logout");
      toast.success("Logout Success");
      router.push("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <hr />
      <h2>
        {user ? (
          <Link href={`/profile/${user._id}`}>
            <p>
              {" "}
              Username : <output>{user.username}</output>{" "}
            </p>
            <p>
              {" "}
              Email : <output>{user.email}</output>{" "}
            </p>
            <p>
              {" "}
              isverified : <output>
                {user.isVerified ? "True" : "False"}
              </output>{" "}
            </p>
            <p>
              {" "}
              isAdmin : <output>{user.isAdmin ? "True" : "False"}</output>{" "}
            </p>
          </Link>
        ) : (
          "No data for display"
        )}
      </h2>
      <button
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 rounded"
        type="button"
        onClick={getuserDetails}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get User Details"}
      </button>
      <button
        className="bg-red-500 mt-4 hover:bg-red-700 text-white font-bold py-2 rounded"
        type="button"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
