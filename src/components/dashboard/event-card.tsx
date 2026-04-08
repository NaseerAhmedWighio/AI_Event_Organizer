"use client";

import Link from "next/link";
import { Calendar, MapPin, Users, MoreVertical, Sparkles, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime, getStatusColor, getCategoryColor, hasEventDatePassed } from "@/lib/utils";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description?: string;
    date: string;
    location: string;
    status: string;
    attendees?: string[];
    category?: string;
    aiPlan?: any;
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-border">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-xl truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {event.title}
            </h3>
            {event.category && (
              <span
                className={`inline-block mt-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium ${getCategoryColor(
                  event.category
                )}`}
              >
                {event.category}
              </span>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex-shrink-0">
                <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/events/${event._id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/events/${event._id}/edit`}>Edit Event</Link>
              </DropdownMenuItem>
              {event.aiPlan && (
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/events/${event._id}#ai-plan`}>
                    View AI Plan
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">{formatDateTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>{event.attendees.length} attendees</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(
              event.status
            )}`}
          >
            {event.status}
          </span>
          {event.aiPlan && (
            <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-primary/20 to-secondary/20 text-primary">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              AI Planned
            </span>
          )}
          {event.status === "upcoming" && hasEventDatePassed(event.date) && (
            <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              Date Passed
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0">
        <Link href={`/dashboard/events/${event._id}`} className="w-full">
          <Button variant="secondary" size="lg" className="w-full rounded-xl text-sm sm:text-base">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
