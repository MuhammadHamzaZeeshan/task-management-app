"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CalendarClock, Clock3, FolderKanban, ShieldCheck } from "lucide-react"

interface TaskDto {
    TaskId: number;
    Title: string;
    Description: string;
    Priority: number;
    CreatedBy: string;
    TaskCompletionDate: string;
    StatusId: number;
    CategoryId: number;
    IsActive: boolean;
    CreatedOn: string;
}

interface ApiResponse<T = unknown> {
    Result: T;
    Message: string;
    IsSuccess: boolean;
}

const TaskDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const [task, setTask] = useState<TaskDto | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [createdByName, setCreatedByName] = useState<string>("")

    useEffect(() => {
        // Simulate API call to fetch task details
        const fetchTaskDetails = async () => {
            try {
                setLoading(true)

                const token = JSON.parse(localStorage.getItem("user") || "{}")?.Token;

                const response = await fetch(`http://localhost:5296/api/task/GetTaskById/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch task")

                const data: ApiResponse<TaskDto> = await response.json()

                if (data.IsSuccess && data.Result) {
                    setTask(data.Result)
                } else {
                    throw new Error(data.Message || "Task not found")
                }

            } catch (err) {
                setError("Failed to load task")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTaskDetails()
    }, [id])

    // Fetch the created by user's name
    useEffect(() => {
        if (task?.CreatedBy) {
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (currentUser?.User?.ID === task.CreatedBy) {
                setCreatedByName(currentUser.User.Name);
            } else {
                // Fetch user info from backend
                const fetchUserName = async () => {
                    try {
                        const token = JSON.parse(localStorage.getItem("user") || "{}")?.Token;
                        const response = await fetch(`http://localhost:5296/api/user/GetUser/${task.CreatedBy}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        if (response.ok) {
                            const data = await response.json();
                            setCreatedByName(data.Result?.Name || "Unknown User");
                        }
                    } catch (err) {
                        console.error("Failed to fetch user name:", err);
                        setCreatedByName("Unknown User");
                    }
                };
                fetchUserName();
            }
        }
    }, [task?.CreatedBy])

    // Helper functions to convert IDs to readable text
    const getStatusText = (statusId: number): string => {
        switch (statusId) {
            case 1:
                return "Pending"
            case 2:
                return "In Progress"
            case 3:
                return "Completed"
            default:
                return "Unknown"
        }
    }

    const getCategoryText = (categoryId: number): string => {
        switch (categoryId) {
            case 1:
                return "Bug"
            case 2:
                return "Feature Request"
            case 3:
                return "Maintenance"
            default:
                return "Unknown"
        }
    }

    const getPriorityText = (priority: number): string => {
        switch (priority) {
            case 1:
                return "Lowest"
            case 2:
                return "Low"
            case 3:
                return "Medium"
            case 4:
                return "High"
            case 5:
                return "Highest"
            default:
                return "Unknown"
        }
    }

    // Format date for display
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Loading Task Details...</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col space-y-4">
                                <div className="h-8 bg-muted rounded animate-pulse"></div>
                                <div className="h-24 bg-muted rounded animate-pulse"></div>
                                <div className="h-8 bg-muted rounded animate-pulse"></div>
                                <div className="h-8 bg-muted rounded animate-pulse"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (error || !task) {
        return (
            <div className="container mx-auto p-6">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-destructive">Error</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p>{error || "Task not found"}</p>
                        </CardContent>
                        <CardFooter>
                            <Link to="/userHome">
                                <Button>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Task List
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-6xl p-4 md:p-6">
            <div className="mb-5 rounded-2xl border bg-white p-5 shadow-sm md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Work Item #{task.TaskId}</p>
                        <h2 className="text-2xl font-bold text-slate-800">{task.Title}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge className="bg-slate-100 text-slate-700">{getPriorityText(task.Priority)}</Badge>
                        <Badge className="bg-blue-100 text-blue-700">{getCategoryText(task.CategoryId)}</Badge>
                        <Badge
                            className={
                                task.StatusId === 3
                                    ? "bg-emerald-100 text-emerald-700"
                                    : task.StatusId === 2
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-slate-100 text-slate-700"
                            }
                        >
                            {getStatusText(task.StatusId)}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                <Card className="border-slate-200 bg-white shadow-xl lg:col-span-2">
                    <CardHeader className="border-b bg-slate-50/70 pb-4">
                        <CardTitle className="text-xl font-semibold text-slate-800">Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6 md:p-7">
                        <div>
                            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Notes</h3>
                            <p className="whitespace-pre-line rounded-lg border bg-slate-50 p-4 text-slate-700">{task.Description}</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owner</p>
                                <p className="mt-1 font-medium text-slate-800">{createdByName || "Loading..."}</p>
                            </div>
                            <div className="rounded-lg border bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active State</p>
                                <p className="mt-1 font-medium text-slate-800">{task.IsActive ? "Active" : "Inactive"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white shadow-xl">
                    <CardHeader className="border-b bg-slate-50/70 pb-4">
                        <CardTitle className="text-xl font-semibold text-slate-800">Timeline & System</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-6">
                        <div className="rounded-lg border p-3">
                            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><CalendarClock size={14} /> Due At</p>
                            <p className="mt-1 text-sm font-medium text-slate-800">{formatDate(task.TaskCompletionDate)}</p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Clock3 size={14} /> Created On</p>
                            <p className="mt-1 text-sm font-medium text-slate-800">{formatDate(task.CreatedOn)}</p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><FolderKanban size={14} /> Category</p>
                            <p className="mt-1 text-sm font-medium text-slate-800">{getCategoryText(task.CategoryId)}</p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><ShieldCheck size={14} /> Status</p>
                            <p className="mt-1 text-sm font-medium text-slate-800">{getStatusText(task.StatusId)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-5 border-slate-200 bg-white shadow-xl">
                <CardFooter className="px-6 py-4">
                    <Link to="/userHome">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to List
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default TaskDetailPage
