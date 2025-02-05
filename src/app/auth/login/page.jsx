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
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-6 rounded-md shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Login
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="rounded"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="w-4 h-4 border-2 border-t-white border-blue-300 rounded-full animate-spin"></div>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
