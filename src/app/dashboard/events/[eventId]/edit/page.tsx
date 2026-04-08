"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import { updateEvent } from "@/actions/eventActions";
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
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/sonner";

const categories = [
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday" },
  { value: "corporate", label: "Corporate" },
  { value: "other", label: "Other" },
];

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const eventId = params.eventId as string;

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          toast({
            title: "Error",
            description: "Event not found",
            variant: "destructive",
          });
          router.push("/dashboard/events");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load event",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId, router, toast]);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);

    try {
      const dateValue = formData.get("date") as string | null;
      
      console.log("Form values:", {
        title: formData.get("title"),
        description: formData.get("description"),
        date: dateValue,
        location: formData.get("location"),
      });

      const eventData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        date: dateValue || "",
        location: formData.get("location") as string,
        status: (formData.get("status") as "upcoming" | "completed" | "cancelled") || "upcoming",
        budget: formData.get("budget") as string,
        category: (formData.get("category") as string) || "other",
      };

      const result = await updateEvent({
        eventId,
        ...eventData,
      });

      if (result.success) {
        toast({
          title: "Event updated!",
          description: "Your event has been updated successfully.",
        });
        router.push(`/dashboard/events/${eventId}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Toaster />
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/events/${eventId}`}>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your event details
          </p>
        </div>
      </div>

      {/* Form */}
      <form action={handleSubmit} noValidate>
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Make changes to your event information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={event.title}
                placeholder="e.g., Annual Tech Conference 2024"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={event.description}
                placeholder="Describe your event..."
                required
                className="rounded-xl min-h-[120px]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Event Date & Time</Label>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  defaultValue={new Date(event.date).toISOString().slice(0, 16)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={event.location}
                  placeholder="e.g., San Francisco, CA"
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={event.category || "other"}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={event.status || "upcoming"}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Input
                id="budget"
                name="budget"
                defaultValue={event.budget}
                placeholder="e.g., $5000 or $1000-2000"
                className="rounded-xl"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Link href={`/dashboard/events/${eventId}`} className="flex-1">
                <Button type="button" variant="outline" className="w-full rounded-xl">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl gap-2"
              >
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
