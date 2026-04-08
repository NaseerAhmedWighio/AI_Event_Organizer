"use client";

import { useState } from "react";
import { addAttendee, removeAttendee } from "@/actions/eventActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Users, Plus, X, Loader2, Mail } from "lucide-react";

interface AttendeeManagerProps {
  eventId: string;
  attendees: string[];
  onAttendeesChange?: (attendees: string[]) => void;
}

export function AttendeeManager({ eventId, attendees: initialAttendees, onAttendeesChange }: AttendeeManagerProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [attendees, setAttendees] = useState(initialAttendees);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [action, setAction] = useState<"add" | "remove" | null>(null);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleAdd = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (attendees.includes(trimmedEmail)) {
      toast({
        title: "Already added",
        description: "This email is already in the attendee list.",
        variant: "destructive",
      });
      return;
    }

    setAction("add");
    setLoadingEmail(trimmedEmail);
    try {
      const result = await addAttendee(eventId, trimmedEmail);
      if (result.success) {
        const updated = [...attendees, trimmedEmail];
        setAttendees(updated);
        setEmail("");
        onAttendeesChange?.(updated);
        toast({
          title: "Attendee added",
          description: `${trimmedEmail} has been added to the event.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add attendee",
        variant: "destructive",
      });
    } finally {
      setAction(null);
      setLoadingEmail(null);
    }
  };

  const handleRemove = async (emailToRemove: string) => {
    setAction("remove");
    setLoadingEmail(emailToRemove);
    try {
      const result = await removeAttendee(eventId, emailToRemove);
      if (result.success) {
        const updated = attendees.filter((a) => a !== emailToRemove);
        setAttendees(updated);
        onAttendeesChange?.(updated);
        toast({
          title: "Attendee removed",
          description: `${emailToRemove} has been removed from the event.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove attendee",
        variant: "destructive",
      });
    } finally {
      setAction(null);
      setLoadingEmail(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan-600" />
          Attendees ({attendees.length})
        </h3>
      </div>

      {/* Add Attendee Form */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="pl-10 rounded-xl"
            disabled={action === "add"}
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={action === "add" || !email.trim()}
          className="gap-2 rounded-xl"
          size="sm"
        >
          {action === "add" && loadingEmail === email.trim().toLowerCase() ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add
        </Button>
      </div>

      {/* Attendee List */}
      {attendees.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {attendees.map((email) => (
            <div
              key={email}
              className="flex items-center justify-between p-3 rounded-xl bg-muted group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm truncate">{email}</span>
              </div>
              <button
                onClick={() => handleRemove(email)}
                disabled={action === "remove" && loadingEmail === email}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-muted-foreground hover:text-red-500 disabled:opacity-50"
              >
                {action === "remove" && loadingEmail === email ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No attendees added yet</p>
          <p className="text-xs mt-1">Add emails above to track attendees</p>
        </div>
      )}
    </div>
  );
}
