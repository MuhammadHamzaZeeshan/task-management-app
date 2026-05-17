"use client"

import type React from "react"

import { useState } from "react"

import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { User, Mail, Lock, ShieldCheck } from "lucide-react"

import { authService } from "@/services/AuthService"
import { useToast } from "@/context/ToastContext"

// Sign Up Form Schema
const signUpFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
      .regex(/[0-9]/, { message: "Password must contain at least one digit." })
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { message: "Password must contain at least one special character." }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

type SignUpFormValues = z.infer<typeof signUpFormSchema>

export default function SignUpForm() {

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
      console.log("Sign Up Data:", data)
      try {
          setIsSubmitting(true)
          const response = await authService.signUp({
              Name: data.name,
              Email: data.email,
              Password: data.password,
              IsActive: true,
          })

          if (response.IsSuccess) {
              showToast("User registered successfully!", "success")
              navigate("/auth") // Redirect to SignIn page
          } else {
              showToast(response.Message, "error")
          }
      } catch (error) {
          console.error("Signup failed:", error)
          showToast("Failed to register user", "error")
      } finally {
          setIsSubmitting(false)
      }
  }

  return (
    <Form {...signUpForm}>
      <form onSubmit={signUpForm.handleSubmit(onSubmit)} className="space-y-6">
        <p className="text-sm text-slate-500">Create your account details below.</p>
        <FormField
          control={signUpForm.control}
          name="name"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input placeholder="John Doe" className="h-11 pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signUpForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input placeholder="example@example.com" className="h-11 pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signUpForm.control}
          name="password"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input type="password" placeholder="Create a password" className="h-11 pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signUpForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input type="password" placeholder="Confirm password" className="h-11 pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
              <Button type="submit" className="h-11 w-full text-base" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
      </form>
    </Form>
  )
}
