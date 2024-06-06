"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import {
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordError && !buttonDisabled) {
      login();
    }
  };

  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      // Determine if the user is logging in with email or username
      const loginData = user.email ? { email: user.email, password: user.password } : { username: user.username, password: user.password };

      const res = await axios.post("/api/v1/users/login", loginData);
      console.log("Login Successfully", res);
      toast.success("Login Successfully");
      router.push("/profile");
    } catch (error: any) {
      toast.error("Login Failed");
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordsMatch = () => {
    return user.password === user.confirmPassword;
  };

  const signuproute = ()=>{
    router.push('/register')
  }

  useEffect(() => {
    setPasswordError(!checkPasswordsMatch());
  }, [user.password, user.confirmPassword]);

  useEffect(() => {
    if (
      (user.email.length > 0 || user.username.length > 0) &&
      user.password.length > 0 &&
      user.confirmPassword.length > 0 &&
      checkPasswordsMatch()
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user, passwordError]);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes("@")) {
      setUser({ ...user, email: value, username: "" });
    } else {
      setUser({ ...user, username: value, email: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Auth Using NextJs
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Login to Auth NextJs
      </p>
      {"\n"}
      {"\n"}
      <p className="text-3xl">{loading ? "Processing....." : ""}</p>
      <p className="text-3xl">{passwordError ? "Passwords must match" : ""}</p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="emailOrUsername">Email Address or Username</Label>
          <Input
            id="emailOrUsername"
            placeholder="yourmail@address.com or Username"
            type="text"
            value={user.email || user.username}
            onChange={handleUserInputChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={passwordVisible ? "text" : "password"}
              minLength={6}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type={confirmPasswordVisible ? "text" : "password"}
              minLength={6}
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </LabelInputContainer>

        <button
          disabled={buttonDisabled}
          className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${
            buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
        >
          {loading ? "Submitting..." : `Login -->`}
          <BottomGradient />
        </button>
        <div className="mt-4"></div>
        <button
          onClick={signuproute}
          className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] `}
          type="submit"
        >
          Register &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default LoginPage;
