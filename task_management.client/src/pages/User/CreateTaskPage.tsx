"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import { CalendarClock, Flag, FolderKanban, ListChecks, PencilLine } from "lucide-react"


import { taskService } from "@/services/TaskService";

interface CreateTaskDto {
    Title: string;
    Description: string;
    Priority: number;
    CreatedBy: string;
    TaskCompletionDate: string;
    StatusId: number;
    CategoryId: number;
    IsActive: boolean;
}

const CreateTaskPage = () => {
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [formData, setFormData] = useState<CreateTaskDto>({
        Title: "",
        Description: "",
        Priority: 3, 
        TaskCompletionDate: "", 
        StatusId: 1, 
        CategoryId: 1, 
        IsActive: true,
        CreatedBy: user.User.ID,
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSelectChange = (name: keyof CreateTaskDto, value: string) => {
        setFormData({
            ...formData,
            [name]: Number.parseInt(value, 10),
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const taskData = {
            Title: formData.Title,
            Description: formData.Description,
            Priority: formData.Priority,
            TaskCompletionDate: new Date(formData.TaskCompletionDate).toISOString(),
            StatusId: formData.StatusId,
            CategoryId: formData.CategoryId,
            IsActive: true,
            CreatedBy: user.User.ID,
        }

        console.log("Task Data Being Sent:", JSON.stringify(taskData, null, 2))

        try {
            const response = await taskService.createTask(taskData);

            if (response.IsSuccess) {
                showToast("Task created successfully!", "success");
                navigate("/userHome");
            } else {
                showToast(response.Message || "Failed to create task", "error");
            }
            
        } catch (error) {
            console.error("Failed to create task:", error);
            showToast("An error occurred while creating the task.", "error");
        }

    }

    return (
        <div className="mx-auto max-w-6xl p-4 md:p-6">
            <div className="mb-5 rounded-2xl border bg-white p-5 shadow-sm md:p-6">
                <h2 className="text-2xl font-bold text-slate-800">New Work Item</h2>
                <p className="mt-1 text-sm text-slate-500">Fill in the details below to add a new item to your board.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-3">
                <Card className="border-slate-200 bg-white shadow-xl lg:col-span-2">
                    <CardHeader className="border-b bg-slate-50/70 pb-4">
                        <CardTitle className="text-xl font-semibold text-slate-800">Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 p-6 md:p-7">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="inline-flex items-center gap-2"><PencilLine size={14} /> Work Item Name</Label>
                            <Input
                                id="title"
                                name="Title"
                                value={formData.Title}
                                onChange={handleInputChange}
                                placeholder="Example: Resolve login timeout issue"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="inline-flex items-center gap-2"><ListChecks size={14} /> Notes</Label>
                            <Textarea
                                id="description"
                                name="Description"
                                value={formData.Description}
                                onChange={handleInputChange}
                                placeholder="Add context, expected output, blockers, or any important details..."
                                className="min-h-[170px]"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white shadow-xl">
                    <CardHeader className="border-b bg-slate-50/70 pb-4">
                        <CardTitle className="text-xl font-semibold text-slate-800">Planning</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <div className="space-y-2">
                            <Label htmlFor="completionDate" className="inline-flex items-center gap-2"><CalendarClock size={14} /> Due At</Label>
                            <Input
                                id="completionDate"
                                name="TaskCompletionDate"
                                type="datetime-local"
                                value={formData.TaskCompletionDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="Priority" className="inline-flex items-center gap-2"><Flag size={14} /> Priority Level</Label>
                            <Select
                                value={formData.Priority.toString()}
                                onValueChange={(value) => handleSelectChange("Priority", value)}
                            >
                                <SelectTrigger id="Priority">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 - Lowest</SelectItem>
                                    <SelectItem value="2">2 - Low</SelectItem>
                                    <SelectItem value="3">3 - Medium</SelectItem>
                                    <SelectItem value="4">4 - High</SelectItem>
                                    <SelectItem value="5">5 - Highest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Progress State</Label>
                            <Select
                                value={formData.StatusId.toString()}
                                onValueChange={(value) => handleSelectChange("StatusId", value)}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Pending</SelectItem>
                                    <SelectItem value="2">In Progress</SelectItem>
                                    <SelectItem value="3">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="inline-flex items-center gap-2"><FolderKanban size={14} /> Work Type</Label>
                            <Select
                                value={formData.CategoryId.toString()}
                                onValueChange={(value) => handleSelectChange("CategoryId", value)}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Bug</SelectItem>
                                    <SelectItem value="2">Feature Request</SelectItem>
                                    <SelectItem value="3">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-3">
                    <Card className="border-slate-200 bg-white shadow-xl">
                        <CardFooter className="flex flex-wrap justify-between gap-4 px-6 py-4">
                            <Button type="button" variant="outline" onClick={() => navigate("/userHome")}>Discard</Button>
                            <Button type="submit">Save Item</Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    )
}

export default CreateTaskPage
