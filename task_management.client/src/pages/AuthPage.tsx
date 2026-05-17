"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignInForm from "../components/Auth/SignInForm"
import SignUpForm from "../components/Auth/SignUpForm"

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState("signin")

    return (
        <div className="flex min-h-[75vh] items-center justify-center p-4 md:p-6">
            <Card className="w-full max-w-xl border-slate-200 bg-white shadow-xl">
                <CardHeader className="space-y-2 border-b bg-slate-50/70 pb-5">
                    <CardTitle className="text-center text-3xl font-bold text-slate-800">
                        {activeTab === "signin" ? "Sign In" : "Sign Up"}
                    </CardTitle>
                    <CardDescription className="text-center text-slate-500">
                        {activeTab === "signin"
                            ? "Sign in to access your account"
                            : "Create a new account to get started"}
                    </CardDescription>
                </CardHeader>
                <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mx-6 mt-5 grid h-11 w-auto grid-cols-2 rounded-lg border bg-slate-100 p-1">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <CardContent className="p-6 pt-5 md:p-7">
                        <TabsContent value="signin">
                            <SignInForm />
                        </TabsContent>
                        <TabsContent value="signup">
                            <SignUpForm />
                        </TabsContent>
                    </CardContent>
                </Tabs>
                <CardFooter className="hidden" />
            </Card>
        </div>
    )
}
