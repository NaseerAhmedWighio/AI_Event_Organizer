"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import { createEvent } from "@/actions/eventActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categories = [
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday" },
  { value: "corporate", label: "Corporate" },
  { value: "other", label: "Other" },
];

interface FormErrors {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  // Form state to preserve data on errors
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    status: "upcoming",
    budget: "",
    category: "other",
  });

  const validateField = (name: string, value: string | null): string | undefined => {
    // Don't validate if the field hasn't been touched or is empty (unless it's a required field being submitted)
    if (value === null || value === "") {
      if (name === "date") return "Date is required";
      if (name === "title") return "Title is required";
      if (name === "description") return "Description is required";
      if (name === "location") return "Location is required";
      return undefined;
    }

    switch (name) {
      case "title":
        if (value.trim().length < 3) {
          return "Title must be at least 3 characters";
        }
        if (value.length > 100) {
          return "Title must be less than 100 characters";
        }
        break;
      case "description":
        if (value.trim().length < 10) {
          return "Description must be at least 10 characters";
        }
        break;
      case "date":
        const selectedDate = new Date(value);
        if (isNaN(selectedDate.getTime())) {
          return "Invalid date format";
        }
        break;
      case "location":
        if (value.trim().length === 0) {
          return "Location is required";
        }
        break;
    }
    return undefined;
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    // Update form state
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (formErrors[fieldName as keyof FormErrors]) {
      const error = validateField(fieldName, value || null);
      if (!error) {
        setFormErrors((prev) => ({
          ...prev,
          [fieldName]: undefined,
        }));
      }
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName as keyof typeof formData] || null);
    setFormErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Validate all fields before submission
      const errors: FormErrors = {};
      const titleError = validateField("title", formData.title);
      const descriptionError = validateField("description", formData.description);
      const dateError = validateField("date", formData.date);
      const locationError = validateField("location", formData.location);

      if (titleError) errors.title = titleError;
      if (descriptionError) errors.description = descriptionError;
      if (dateError) errors.date = dateError;
      if (locationError) errors.location = locationError;

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        // Mark all fields as touched to show errors
        setTouchedFields({
          title: true,
          description: true,
          date: true,
          location: true,
        });
        toast.error("Please fix the form errors", {
          description: "Some fields need your attention",
          duration: 4000,
        });
        setIsSubmitting(false);
        return;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        status: formData.status as "upcoming" | "completed" | "cancelled",
        budget: formData.budget,
        category: formData.category,
        userId: user?.id || "",
      };

      const result = await createEvent(eventData);

      if (result.success && result.data) {
        // Show success toast with celebration
        toast.success("Event Created Successfully! 🎉", {
          description: `${eventData.title} has been added to your dashboard.`,
          duration: 5000,
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
        });

        // Small delay for user to see the success message
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Redirect to the event detail page
        router.push(`/dashboard/events/${result.data._id}`);
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Event creation error:", error);

      // Show error toast - form data is preserved
      toast.error("Failed to Create Event", {
        description: error instanceof Error ? error.message : "Please try again.",
        duration: 5000,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isDisabled = isSubmitting || !user;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/events">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Create New Event
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Fill in the details to create your event
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-600 to-cyan-500" />
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Event Details</CardTitle>
            <CardDescription className="text-base">
              Provide the basic information about your event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Event Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                placeholder="e.g., Annual Tech Conference 2024"
                disabled={isDisabled}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                onBlur={() => handleFieldBlur("title")}
                className={cn(
                  "rounded-xl h-12 transition-all focus:ring-2 focus:ring-indigo-500",
                  formErrors.title && touchedFields.title && "border-red-500 focus:ring-red-500"
                )}
              />
              {formErrors.title && touchedFields.title ? (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.title}
                </p>
              ) : (
                <p className="text-xs text-gray-500">Minimum 3 characters, maximum 100 characters</p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                placeholder="Describe your event, its purpose, and what attendees can expect..."
                disabled={isDisabled}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                onBlur={() => handleFieldBlur("description")}
                className={cn(
                  "rounded-xl min-h-[140px] transition-all focus:ring-2 focus:ring-indigo-500",
                  formErrors.description && touchedFields.description && "border-red-500 focus:ring-red-500"
                )}
              />
              {formErrors.description && touchedFields.description ? (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.description}
                </p>
              ) : (
                <p className="text-xs text-gray-500">Minimum 10 characters</p>
              )}
            </div>

            {/* Date and Location Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Event Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  disabled={isDisabled}
                  onChange={(e) => handleFieldChange("date", e.target.value)}
                  onBlur={() => handleFieldBlur("date")}
                  className={cn(
                    "rounded-xl h-12 transition-all focus:ring-2 focus:ring-indigo-500",
                    formErrors.date && touchedFields.date && "border-red-500 focus:ring-red-500"
                  )}
                />
                {formErrors.date && touchedFields.date ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.date}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">Select date for your event</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  placeholder="e.g., San Francisco, CA or Virtual"
                  disabled={isDisabled}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  onBlur={() => handleFieldBlur("location")}
                  className={cn(
                    "rounded-xl h-12 transition-all focus:ring-2 focus:ring-indigo-500",
                    formErrors.location && touchedFields.location && "border-red-500 focus:ring-red-500"
                  )}
                />
                {formErrors.location && touchedFields.location ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.location}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Category and Status Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleFieldChange("category", value)}
                  disabled={isDisabled}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleFieldChange("status", value)}
                  disabled={isDisabled}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Field */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium">
                Budget <span className="text-gray-400">(Optional)</span>
              </Label>
              <Input
                id="budget"
                name="budget"
                value={formData.budget}
                placeholder="e.g., $5000 or $1000-2000"
                disabled={isDisabled}
                onChange={(e) => handleFieldChange("budget", e.target.value)}
                className="rounded-xl h-12 transition-all focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500">Enter your estimated budget for this event</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Link href="/dashboard/events" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl h-12 text-base"
                  disabled={isDisabled}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isDisabled}
                className="flex-1 rounded-xl h-12 text-base gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Create Event
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 pt-2">
              By creating an event, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
