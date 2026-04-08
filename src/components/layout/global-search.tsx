"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/context/AuthContext";
import { Search, Calendar, MapPin, Clock, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { client } from "@/lib/sanityClient";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export interface SearchResult {
  _id: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  category?: string;
  status?: string;
  type: "event" | "aiPlan";
}

interface UseSearchOptions {
  clerkId: string;
  query: string;
  enabled?: boolean;
}

function useSearch({ clerkId, query, enabled = true }: UseSearchOptions) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!clerkId || !query || query.length < 2 || !enabled) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchQuery = `*[_type in ["event", "aiPlan"] && createdBy == $clerkId && (
          title match $query ||
          description match $query ||
          (type == "event" && (category match $query || location match $query))
        )] {
          _id,
          _type,
          title,
          description,
          "date": coalesce(date, _createdAt),
          location,
          category,
          status,
          "type": _type
        } | score(title match $query desc, description match $query desc) | order(_score desc) [0...10]`;

        const fetchedResults = await client.fetch(searchQuery, {
          clerkId,
          query: `${query}*`,
        } as Record<string, unknown>);
        setResults(fetchedResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [clerkId, query, enabled]);

  return { results, isLoading };
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, isLoading } = useSearch({
    clerkId: user?.id || "",
    query,
    enabled: isOpen,
  });

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    if (result.type === "event") {
      router.push(`/dashboard/events/${result._id}`);
    } else if (result.type === "aiPlan") {
      router.push(`/dashboard/ai-assistant?plan=${result._id}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      conference: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      workshop: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      meetup: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      wedding: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
      birthday: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      corporate: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      other: "bg-muted text-muted-foreground",
    };
    return colors[category || "other"] || colors.other;
  };

  const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      upcoming: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status || "upcoming"] || colors.upcoming;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search events, plans..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 rounded-xl bg-background/50 border-border focus:bg-background transition-colors"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[400px] md:w-[500px] p-0" align="start">
        <DropdownMenuLabel className="p-4 pb-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Search</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Searching...</p>
            </div>
          ) : query.length < 2 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p>Type at least 2 characters to search</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No results found for &quot;{query}&quot;
              </p>
              <p className="text-xs text-muted-foreground/50 mt-1">
                Try different keywords
              </p>
            </div>
          ) : (
            <DropdownMenuGroup className="p-2">
              {results.map((result) => (
                <DropdownMenuItem
                  key={result._id}
                  className="flex flex-col items-start gap-2 p-4 cursor-pointer"
                  onClick={() => handleSelect(result)}
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <div className="flex items-center gap-2">
                      {result.type === "event" ? (
                        <Calendar className="h-4 w-4 text-indigo-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-600" />
                      )}
                      <p className="font-medium text-sm">{result.title}</p>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>

                  {result.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 ml-6">
                      {result.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 ml-6 mt-1 flex-wrap">
                    {result.date && (
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(result.date), "MMM d, yyyy")}
                      </Badge>
                    )}
                    {result.location && (
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {result.location}
                      </Badge>
                    )}
                    {result.category && result.type === "event" && (
                      <Badge className={`text-xs ${getCategoryColor(result.category)}`}>
                        {result.category}
                      </Badge>
                    )}
                    {result.status && (
                      <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                        {result.status}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          )}
        </ScrollArea>

        {results.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
