"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const router = useRouter();
  const [user, setuser] = useState({
    userCred: "",
    password: "",
    confirmpassword: "",
  });

  const [passwordError, setpasswordError] = useState(false);
  const [Type, setType] = useState(true);
  const [buttonDisabled, setbuttonDisabled] = useState(false);
  const [loading, setloading] = useState(false);

  const login = async () => {
    try {
      setloading(true);
      const res = await axios.post("/api/v1/users/login", user);
      console.log("Login Successfully ", res);
      toast.success("Login Sucessfully");
      router.push("/profile");
    } catch (error: any) {
      toast.error("Login Failed");
      toast.error(error.message);
      console.log(error);
    }
  };
  useEffect(() => {
    if (
      user.password === user.confirmpassword &&
      user.confirmpassword.length === user.password.length
    ) {
      setpasswordError(false);
    } else {
      setpasswordError(true);
    }
  }, [user.password]);

  useEffect(() => {
    if (
      user.userCred.length > 0 &&
      user.password.length > 0 &&
      user.confirmpassword.length > 0
    ) {
      setbuttonDisabled(false);
    } else {
      setbuttonDisabled(true);
    }
  }, [user]);

  useEffect(() => {
    if (user.userCred.includes("@")) {
      setType(true);
    } else {
      setType(false);
    }
  }, [user.userCred]);

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
      <p className="text-3xl">
        {passwordError ? "Password must be same...." : ""}
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div> */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor={Type ? "email" : "username"}>
            Email Address or Username
          </Label>
          <Input
            id="email"
            placeholder="yourmail@address.com or Username"
            type={Type ? "email" : "text"}
            value={user.userCred}
            onChange={(e) => setuser({ ...user, userCred: e.target.value })}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            minLength={6}
            value={user.password}
            onChange={(e) => setuser({ ...user, password: e.target.value })}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Confirm Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            minLength={6}
            value={user.confirmpassword}
            onChange={(e) =>
              setuser({ ...user, confirmpassword: e.target.value })
            }
          />
        </LabelInputContainer>

        <button
          disabled={buttonDisabled}
          onClick={login}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {buttonDisabled ? "Submitting..." : `Login -->`}
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        {/* <div className="flex flex-col space-y-4">
          <button
            className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
          <button
            className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
          >
            <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              OnlyFans
            </span>
            <BottomGradient />
          </button>
        </div> */}
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
