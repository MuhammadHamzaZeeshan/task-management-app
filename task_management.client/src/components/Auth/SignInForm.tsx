"use client"

import type React from "react"

import { useState } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { Mail, Lock } from "lucide-react"

import { authService } from "@/services/AuthService"

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

// Sign In Form Schema
const signInFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

type SignInFormValues = z.infer<typeof signInFormSchema>

export default function SignInForm() {

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const signInForm = useForm<SignInFormValues>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const { login } = useAuth();
    const { showToast } = useToast();

    const onSubmit = async (data: SignInFormValues) => {
        console.log("Sign Up Data:", data)
        try {
            setIsSubmitting(true)
            const response = await authService.signIn({
                Email: data.email,
                Password: data.password
            })

            if (response.IsSuccess) {

                localStorage.setItem("user", JSON.stringify(response.Result));
                console.log(localStorage.getItem("user"));
                login();

                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const role = user.User.Role;

                if (role == "USER") {
                    navigate("/userHome");
                }
                else {
                    navigate("/dashboard");
                }

            } else {
                showToast(response.Message, "error")
            }
        } catch (error) {
            console.error("Signup failed:", error)
            showToast("Failed to sign in", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-6">
                <p className="text-sm text-slate-500">Enter your credentials to continue.</p>
                <FormField
                    control={signInForm.control}
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
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="gap-1.5">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                    <Input type="password" placeholder="Enter your password" className="h-11 pl-10" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="h-11 w-full text-base" disabled={isSubmitting}>
                    {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>

            </form>
        </Form>
    )
}
