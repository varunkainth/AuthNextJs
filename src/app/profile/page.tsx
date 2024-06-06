"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/v1/users/profile");
        setUser(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile. Please try again later.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Profile Page</h1>
      <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold">Welcome, {user.username}!</h2>
        <p className="mt-4">Username: {user.username}</p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
