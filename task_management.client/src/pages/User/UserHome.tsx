"use client"

import type React from "react"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Info } from "lucide-react"
import { Link } from "react-router-dom" 


import { taskService } from "@/services/TaskService";

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


const getStatusText = (status: number): string => {
    switch (status) {
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

// Function to get the appropriate color for status badges
const getStatusColor = (status: number): string => {
    switch (status) {
        case 3: // Completed
            return "bg-green-100 text-green-800 hover:bg-green-100"
        case 2: // In Progress
            return "bg-blue-100 text-blue-800 hover:bg-blue-100"
        case 1: // Pending
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
}

const TaskListPage: React.FC = () => {

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [tasks, setTasks] = useState<TaskDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const id = user.User.ID;
                console.log("user id : ", id);
                const data = await taskService.getUserTask();
                setTasks(data);
            } catch (err) {
                console.error("Failed to load tasks:", err)
                setError("Failed to load tasks.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);



    if (loading) {
        return (
            <div className="mx-auto max-w-4xl py-10">
                <Card className="p-6">
                    <p className="text-slate-600">Loading your tasks...</p>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-4xl py-10">
                <Card className="border-red-200 bg-red-50 p-6">
                    <p className="text-red-700">{error}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl py-4 md:py-6">
            <div className="mb-5 rounded-xl border bg-white/90 p-4 shadow-sm md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">My Tasks</h2>
                        <p className="text-sm text-slate-500">Track and manage your pending work</p>
                    </div>
                    <Link to="/createTask">
                        <Button className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Create Task
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {tasks.map((task) => (
                    <Card key={task.TaskId} className="overflow-hidden border-slate-200 bg-white/95">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-lg font-semibold text-slate-800">{task.Title}</h3>
                                <Badge className={`${getStatusColor(task.StatusId)} border font-medium`}>{getStatusText(task.StatusId)}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-1 pb-2">
                            <p className="line-clamp-2 text-slate-600">{task.Description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t bg-slate-50/70 p-4 pt-3">
                            <Link to={`/detailTask/${task.TaskId}`}>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Info className="h-4 w-4" />
                                    Details
                                </Button>
                            </Link>
                            <Link to={`/UpdateTask/${task.TaskId}`}>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                            <Link to={`/deleteTask/${task.TaskId}`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {tasks.length === 0 && (
                <div className="py-10 text-center">
                    <Card className="mx-auto max-w-xl border-dashed bg-slate-50/80 p-8">
                        <p className="text-slate-600">No tasks found. Create a new task to get started.</p>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default TaskListPage
