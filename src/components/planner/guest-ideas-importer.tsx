"use client";

import { useState } from "react";
import { addAttendee } from "@/actions/eventActions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Users, Plus, Mail, Loader2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GuestIdeasImporterProps {
  eventId: string;
  guestIdeas: string[];
  existingAttendees: string[];
  onAttendeesChange?: (attendees: string[]) => void;
}

export function GuestIdeasImporter({
  eventId,
  guestIdeas,
  existingAttendees,
  onAttendeesChange,
}: GuestIdeasImporterProps) {
  const { toast } = useToast();
  const [importing, setImporting] = useState<Set<string>>(new Set());
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [bulkEmailInput, setBulkEmailInput] = useState("");
  const [isBulkImporting, setIsBulkImporting] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleImportSingle = async (guestIdea: string) => {
    // Treat guest idea as a potential email or convert to placeholder email
    const email = guestIdea.includes("@")
      ? guestIdea.toLowerCase().trim()
      : `${guestIdea.toLowerCase().replace(/\s+/g, ".")}@example.com`;

    if (existingAttendees.includes(email) || imported.has(email)) {
      toast({
        title: "Already an attendee",
        description: `${guestIdea} is already in the attendee list.`,
        variant: "destructive",
      });
      return;
    }

    setImporting((prev) => new Set(prev).add(guestIdea));
    try {
      const result = await addAttendee(eventId, email);
      if (result.success) {
        const updated = [...existingAttendees, email];
        onAttendeesChange?.(updated);
        setImported((prev) => new Set(prev).add(email));
        toast({
          title: "Guest added",
          description: `${guestIdea} has been added as an attendee.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add ${guestIdea}`,
        variant: "destructive",
      });
    } finally {
      setImporting((prev) => {
        const next = new Set(prev);
        next.delete(guestIdea);
        return next;
      });
    }
  };

  const handleBulkImport = async () => {
    const emails = bulkEmailInput
      .split(/[\n,]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e && isValidEmail(e) && !existingAttendees.includes(e));

    if (emails.length === 0) {
      toast({
        title: "No valid emails",
        description: "Please enter valid email addresses that aren't already attendees.",
        variant: "destructive",
      });
      return;
    }

    setIsBulkImporting(true);
    try {
      let added = 0;
      const allEmails = [...existingAttendees];
      for (const email of emails) {
        const result = await addAttendee(eventId, email);
        if (result.success) {
          allEmails.push(email);
          added++;
        }
      }
      onAttendeesChange?.(allEmails);
      setBulkEmailInput("");
      toast({
        title: "Bulk import complete",
        description: `${added} attendee(s) were added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import some attendees",
        variant: "destructive",
      });
    } finally {
      setIsBulkImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan-600" />
          AI Guest Ideas
        </h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Click the + button to add suggested guest types as attendees. Emails will be generated based on the suggestions.
      </p>

      {/* Guest Idea Tags */}
      <div className="flex flex-wrap gap-2">
        {guestIdeas.map((idea) => {
          const isImported = imported.has(idea) || existingAttendees.some(
            (a) => a.includes(idea.toLowerCase().replace(/\s+/g, "."))
          );
          const isImporting = importing.has(idea);

          return (
            <div
              key={idea}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isImported
                  ? "bg-success-muted text-success"
                  : "bg-secondary-muted text-secondary"
              }`}
            >
              {isImported ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              <span>{idea}</span>
              {!isImported && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 rounded-lg hover:bg-secondary/30"
                  onClick={() => handleImportSingle(idea)}
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bulk Import */}
      <div className="p-4 rounded-xl bg-muted space-y-3">
        <h4 className="font-medium text-sm">Bulk Import Emails</h4>
        <p className="text-xs text-muted-foreground">Enter email addresses separated by commas or new lines</p>
        <textarea
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
          placeholder="john@example.com, jane@example.com"
          value={bulkEmailInput}
          onChange={(e) => setBulkEmailInput(e.target.value)}
          disabled={isBulkImporting}
        />
        <Button
          size="sm"
          onClick={handleBulkImport}
          disabled={isBulkImporting || !bulkEmailInput.trim()}
          className="gap-2 rounded-xl"
        >
          {isBulkImporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Users className="h-4 w-4" />
              Import All
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
