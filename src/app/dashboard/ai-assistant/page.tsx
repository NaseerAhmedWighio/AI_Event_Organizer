"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Lightbulb, Calendar, DollarSign, Users, Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";

export default function AIAssistantPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    eventIdea: "",
    eventType: "corporate",
    expectedAttendees: "",
    budgetRange: "",
    specialRequirements: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Call OpenAI through our API route
      const response = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await response.json();
      setResult(data);
      toast({
        title: "AI Plan Generated!",
        description: "Your custom event plan is ready.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <DashboardLayout>
      <Toaster />
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-indigo-100 to-cyan-100 dark:from-indigo-900/30 dark:to-cyan-900/30">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              AI-Powered Event Planning
            </span>
          </div>
          <h1 className="text-4xl font-bold">AI Event Assistant</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Describe your event idea and let AI create a comprehensive plan with
            schedule, budget, and expert suggestions.
          </p>
        </div>

        {/* Input Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Tell us about your event</CardTitle>
            <CardDescription>
              Provide details about your event and our AI will generate a
              customized plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="eventIdea">Event Idea *</Label>
                <Textarea
                  id="eventIdea"
                  placeholder="Describe your event idea in detail. What's the purpose? What experience do you want to create?"
                  value={formData.eventIdea}
                  onChange={(e) =>
                    setFormData({ ...formData, eventIdea: e.target.value })
                  }
                  required
                  className="rounded-xl min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, eventType: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="meetup">Meetup</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendees">Expected Attendees</Label>
                  <Input
                    id="attendees"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.expectedAttendees}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expectedAttendees: e.target.value,
                      })
                    }
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $5000-10000"
                    value={formData.budgetRange}
                    onChange={(e) =>
                      setFormData({ ...formData, budgetRange: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any special requirements, themes, or constraints?"
                  value={formData.specialRequirements}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialRequirements: e.target.value,
                    })
                  }
                  className="rounded-xl min-h-[80px]"
                />
              </div>

              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full h-12 rounded-xl gap-2 text-base"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating AI Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate AI Plan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Schedule */}
            {result.schedule && result.schedule.length > 0 && (
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Suggested Schedule</CardTitle>
                      <CardDescription>
                        AI-optimized timeline for your event
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.schedule.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900"
                      >
                        <div className="text-sm font-medium text-indigo-600 min-w-[80px] sm:min-w-[100px]">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.activity}</p>
                          {item.duration && (
                            <p className="text-sm text-gray-500">
                              {item.duration} minutes
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Budget */}
            {result.budget && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-emerald-600 to-green-500 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Budget Breakdown</CardTitle>
                      <CardDescription>
                        Suggested budget allocation
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    {typeof result.budget === "string" ? (
                      <p className="whitespace-pre-line">{result.budget}</p>
                    ) : typeof result.budget === "object" && result.budget !== null ? (
                      <div className="space-y-2">
                        {Object.entries(result.budget).map(([category, amount]) => (
                          <div key={category} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <span className="font-medium">{category}</span>
                            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                              ${typeof amount === 'number' ? amount.toLocaleString() : String(amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {result.suggestions && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-600 to-orange-500 flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Expert Suggestions</CardTitle>
                      <CardDescription>
                        AI-powered recommendations
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                    <p className="whitespace-pre-line">{result.suggestions}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Guest Ideas */}
            {result.guestIdeas && result.guestIdeas.length > 0 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Guest Ideas</CardTitle>
                      <CardDescription>
                        Suggested guest types or categories
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.guestIdeas.map((idea: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm font-medium"
                      >
                        {idea}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
