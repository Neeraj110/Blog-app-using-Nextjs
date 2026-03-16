"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCredential } from "@/redux/slices/authSlice";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/user/login", values);
      if (response.status === 200) {
        dispatch(setCredential(response.data.user));
        router.push("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        form.setError("root", {
          message: error.response.data.error || "Login failed",
        });
      } else {
        form.setError("root", {
          message: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900/20 text-white">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-black/40 backdrop-blur-2xl border border-white/10 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">Sign in to continue to SocialHub</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500 transition-all h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500 transition-all h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 rounded-xl shadow-lg shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center gap-2">
                  <div className="w-5 h-5 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center mt-8 text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 hover:to-pink-400 font-semibold hover:underline decoration-purple-400/50 underline-offset-4 transition-all">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
