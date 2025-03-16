"use client";

import { useAuth } from "@/components/provider/auth-provider";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSearchParams, redirect, useRouter } from "next/navigation";
import React, { Suspense } from "react";
import { toast } from "sonner";

const Varify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("TOKEN");
  const auth = useAuth();
  if (!auth?.loading && auth?.isAuthenticated) {
    redirect("/");
  }
  const handleVarify = () => {
    axios
      .get(`/api/user/verify?TOKEN=${token}`)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          const { email } = res.data.user;
          toast(`${email} verified!`);
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err.status);
        const { message } = err.response.data;
        console.log(message);
        toast(message);
      });
  };
  return (
    <div className="h-[90vh] flex flex-col justify-center items-center gap-4">
      <div>Varify Email</div>
      <Button onClick={handleVarify}>Varify!</Button>
    </div>
  );
};

const VarifyPage = () => {
  return (
    <Suspense>
      <Varify />
    </Suspense>
  );
};

export default VarifyPage;
