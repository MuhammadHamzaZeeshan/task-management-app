"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CalendarClock, Flag, FolderKanban, Loader2, PencilLine } from "lucide-react"

import { taskService } from "@/services/TaskService";
import { useToast } from "@/context/ToastContext";

interface TaskFormData {
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

// Helper function to format date for datetime-local input
const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:MM
}

const UpdateTaskPage = () => {

    const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { showToast } = useToast()


    const [formData, setFormData] = useState<TaskFormData>({
      TaskId:0,
      Title: "",
      Description: "",
      Priority: 3,
      TaskCompletionDate: "",
      StatusId: 1,
      CategoryId: 1,
      CreatedBy: user.User.ID,
      IsActive: true,
      CreatedOn:""
  })

  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Fetch task data to pre-fill the form
        const fetchTaskData = async () => {
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

                const data: ApiResponse<TaskFormData> = await response.json()
                const taskData = data.Result;

                if (taskData) {
                    setFormData({
                        TaskId: taskData.TaskId,
                        Title: taskData.Title,
                        Description: taskData.Description,
                        Priority: taskData.Priority,
                        TaskCompletionDate: formatDateForInput(taskData.TaskCompletionDate),
                        StatusId: taskData.StatusId,
                        CategoryId: taskData.CategoryId,
                        CreatedBy: user.User.ID,
                        IsActive: taskData.IsActive,
                        CreatedOn: taskData.CreatedOn
                    })
                } else {
                    setError("Task not found")
                }
            } catch (err) {
                setError("Failed to load task data")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTaskData()
    }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: keyof TaskFormData, value: string) => {
    setFormData({
      ...formData,
      [name]: Number.parseInt(value, 10),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSubmitting(true)

        const response = await taskService.updateTask(formData);

        if (response.IsSuccess) 
        {
            showToast(`Task "${formData.Title}" has been updated successfully.`, "success");
            navigate("/userHome");
        } else
        {
            showToast(response.Message || "Failed to update task", "error");
        }

    }
    catch (err)
    {
      console.error("Failed to update task:", err)
      showToast("Failed to update task. Please try again.", "error");

    }
    finally
    {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <Card className="border-slate-200 bg-white shadow-xl">
            <CardHeader className="border-b bg-slate-50/70 pb-5">
              <CardTitle className="text-2xl font-bold">Update Task</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading task data...</span>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <Card className="border-slate-200 bg-white shadow-xl">
            <CardHeader className="border-b bg-slate-50/70 pb-5">
              <CardTitle className="text-2xl font-bold text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p>{error}</p>
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
        <h2 className="text-2xl font-bold text-slate-800">Edit Work Item</h2>
        <p className="mt-1 text-sm text-slate-500">Record #{formData.TaskId} can be updated below.</p>
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
              <Label htmlFor="description">Notes</Label>
              <Textarea
                id="description"
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                placeholder="Update details, outcomes, or context..."
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
              <Label htmlFor="priority" className="inline-flex items-center gap-2"><Flag size={14} /> Priority Level</Label>
              <Select
                value={formData.Priority.toString()}
                onValueChange={(value) => handleSelectChange("Priority", value)}
              >
                <SelectTrigger id="priority">
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
            <CardFooter className="flex justify-between px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/detailTask/${id}`)}
                disabled={submitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

export default UpdateTaskPage
