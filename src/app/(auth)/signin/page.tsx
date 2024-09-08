"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/hooks/use-toast";
import { signInValidationSchema } from "@/zodValidators/signInSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { signIn } from "@/auth";

const SignInPage = () => {
  //form states
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInValidationSchema>>({
    resolver: zodResolver(signInValidationSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInValidationSchema>) {
    setIsSubmitting(true);
    console.log("signin form values log : ", values);

    const result = await signIn("credentials", {
      redirect: false,
      identifier: values.identifier,
      password: values.password,
    });

    console.log(
      "printing return statement of SignIn function by auth : ",
      result
    );

    // if (result?.error) {
    //   toast({
    //     title: "Login failed",
    //     description: "Incorrect username or password",
    //     variant: "destructive",
    //   });
    // }
    // if (result?.url) {
    //   router.replace("/dashboard");

    //   toast({
    //     title: "",
    //     description: "",
    //   });
    // }

    // setIsSubmitting(true);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign In to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              SignIn
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Create an account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
