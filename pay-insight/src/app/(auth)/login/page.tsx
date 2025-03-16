"use client";

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/provider/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().min(2).max(50).email(),
  password: z.string().min(8).max(50),
});

const emailFormSchema = z.object({
  email: z.string().min(6).max(50).email(),
});

const Login = () => {
  const [loading, setLoading] = useState({
    button: false,
    forgetPassword: false,
    verifyUser: false,
    overlay: false,
    selectCompany: false,
  });
  const router = useRouter();
  const auth = useAuth();
  if (!auth?.loading && auth?.isAuthenticated) {
    redirect("/");
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading((values) => ({ ...values, button: true }));
    console.log(values);
    axios
      .post("/api/user/login", values)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          const { username, _id, email, givenName, roleInfo } = res.data.user;
          auth?.signIn({ username, _id, email, givenName, roleInfo });
          toast(`${givenName} welcome to onvoid!`, {
            description: "remember password?",
            action: {
              label: "okay!",
              onClick: () => console.log("okay!"),
            },
          });
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          console.log(err.response.data);
          const { status, message } = err.response.data;
          toast(message);
          if (status === 401) {
            setLoading((values) => ({
              ...values,
              forgetPassword: true,
              verifyUser: false,
            }));
          } else if (status === 406) {
            setLoading((values) => ({
              ...values,
              verifyUser: true,
              forgetPassword: false,
            }));
          }
        } else {
          console.log("Server Error!");
        }
        console.log(err);
      })
      .finally(() => {
        setLoading((values) => ({ ...values, button: false }));
      });
  }

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  function handleSubmitEmail(values: z.infer<typeof emailFormSchema>) {
    setLoading((values) => ({ ...values, button: true }));
    console.log(values);
    if (loading.forgetPassword) {
      axios
        .post("/api/user/reset", values)
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            console.log("Email sent, to reset password.");
          }
        })
        .catch((err) => {
          if (err.status === 400) {
            console.log(err.response.data);
          } else {
            console.log("Server Error!");
          }
          console.log(err);
        })
        .finally(() => {
          setLoading((values) => ({ ...values, button: false }));
        });
    } else if (loading.verifyUser) {
      axios
        .post("/api/user/verify", values)
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            console.log("Email sent, to verify email.");
          }
        })
        .catch((err) => {
          if (err.status === 400) {
            console.log(err.response.data);
          } else {
            console.log("Server Error!");
          }
          console.log(err);
        })
        .finally(() => {
          setLoading((values) => ({ ...values, button: false }));
        });
    }
  }

  function handleOpenOverlay() {
    setLoading((values) => ({
      ...values,
      overlay: true,
    }));
  }

  function handleCancel() {
    setLoading((values) => ({ ...values, overlay: false }));
  }

  return (
    <main className="flex h-[90vh] sm:h-screen justify-center items-center">
      <Button className="fixed top-4 left-4" onClick={() => router.back()}>
        <ArrowLeft className="text-2xl" />
      </Button>
      {!loading.overlay && (
        <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your information to log in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {loading.verifyUser && (
                      <span
                        className="self-end text-sm underline cursor-pointer"
                        onClick={handleOpenOverlay}
                      >
                        verify email
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {loading.forgetPassword && (
                      <span
                        className="self-end text-sm underline cursor-pointer"
                        onClick={handleOpenOverlay}
                      >
                        forget password
                      </span>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading.button}
                  >
                    {loading.button ? "Loading..." : "Login to App"}
                  </Button>
                  {/* <div>
                    <script
                      src="https://accounts.google.com/gsi/client"
                      async
                    ></script>
                    <div
                      id="g_id_onload"
                      data-client_id="589945850717-s6ihorkmuagsbmai49cur3bbb3psc8se.apps.googleusercontent.com"
                      data-context="signin"
                      data-ux_mode="popup"
                      data-login_uri={`${DOMAIN}/api/user`}
                      data-auto_select="true"
                      data-itp_support="true"
                    ></div>
                  </div> */}
                </form>
              </Form>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      {loading.overlay && (
        <Card className="mx-auto min-w-[20rem] max-w-[20rem] sm:min-w-[25rem] sm:max-w-[25rem]">
          <CardHeader>
            {loading.verifyUser && (
              <>
                <CardTitle className="text-xl">Verifiy Email</CardTitle>
                <CardDescription>Enter your Email to Verify!.</CardDescription>
              </>
            )}
            {loading.forgetPassword && (
              <>
                <CardTitle className="text-xl">Reset Password</CardTitle>
                <CardDescription>
                  Enter your Email to reset password.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            <div>
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(handleSubmitEmail)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email Address"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={"outline"}
                      className="w-full"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading.button}
                    >
                      {loading.button ? "Loading..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default Login;
