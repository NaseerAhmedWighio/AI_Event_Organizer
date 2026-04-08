"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Star, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createReview, getApprovedReviews } from "@/actions/reviewActions";
import { useToast } from "@/components/ui/use-toast";

interface Review {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userProfilePic: string | null;
  reviewText: string;
  rating: number;
  createdAt: string;
  event?: {
    _id: string;
    title: string;
  };
}

export function ReviewsSection() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setIsLoading(true);
    const result = await getApprovedReviews();
    if (result.success && result.reviews) {
      setReviews(result.reviews);
      setVisibleCount(3);
    }
    setIsLoading(false);
  }

  function showMore() {
    setVisibleCount((prev) => Math.min(prev + 3, reviews.length));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isSignedIn || !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (reviewText.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write at least 10 characters for your review",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createReview({
        userId: user.id,
        userName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
        userEmail: user.email || "",
        userProfilePic: user.profileImageUrl || null,
        reviewText: reviewText.trim(),
        rating,
      });

      if (result.success) {
        toast({
          title: "Review submitted! 🎉",
          description: "Your review has been published successfully",
          variant: "success",
        });

        const newReview: Review = {
          _id: (result.review as any)?._id || `temp-${Date.now()}`,
          userId: user.id,
          userName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          userEmail: user.email || "",
          userProfilePic: user.profileImageUrl || null,
          reviewText: reviewText.trim(),
          rating,
          createdAt: new Date().toISOString(),
        };

        setReviews((prev) => [newReview, ...prev]);
        setReviewText("");
        setRating(5);
        setHoveredRating(0);
        setVisibleCount((prev) => Math.max(prev, 1));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-card dark:to-primary/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            Loved by Event Planners
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            See what professional event planners are saying about AI Event
            Organizer.
          </p>
        </div>

        {/* Review Form - Only visible for signed-in users */}
        {isLoaded && isSignedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto mb-12 sm:mb-16 px-2 sm:px-0"
          >
            <Card className="border-0 shadow-xl bg-card">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <Label className="mb-3 block">Your Rating</Label>
                    <div className="flex md:gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110 p-0.5"
                        >
                          <Star
                            className={`w-4 h-4 md:h-5 md:w-5 transition-colors ${
                              star <= (hoveredRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="-ml-2 md:ml-2 md:text-xs text-[10px] text-muted-foreground self-center ">
                        {rating}/5
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="review">Your Review</Label>
                    <Textarea
                      id="review"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with AI Event Organizer... What did you like? How did it help you?"
                      className="rounded-lg min-h-[100px] sm:min-h-[120px] mt-2 resize-none text-sm sm:text-base"
                      required
                      minLength={10}
                      maxLength={1000}
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {reviewText.length}/1000 characters
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || reviewText.trim().length < 10}
                    className="w-full rounded-lg gap-2 h-10 sm:h-12 text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                        Submit Review
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    ✓ Your review has been published successfully
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sign-in prompt for non-authenticated users */}
        {isLoaded && !isSignedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16 p-6 sm:p-10 lg:p-12 bg-card rounded-2xl sm:rounded-3xl border border-border shadow-lg mx-2 sm:mx-0"
          >
            <CheckCircle className="h-14 w-14 sm:h-20 sm:w-20 mx-auto text-indigo-600 mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 px-2">Share Your Experience</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-lg mx-auto px-2">
              Sign in to write a review and help others discover how AI Event Organizer can transform their event planning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2">
              <Link href="/sign-in">
                <Button size="lg" className="rounded-lg w-full sm:w-auto text-sm sm:text-base">
                  Sign In to Write Review
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="text-center py-10 sm:py-12 px-4">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin mx-auto text-indigo-600" />
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <>
            <div className={
              reviews.slice(0, visibleCount).length === 1
                ? "max-w-2xl mx-auto"
                : reviews.slice(0, visibleCount).length === 2
                ? "grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto"
                : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            }>
              {reviews.slice(0, visibleCount).map((review, index) => {
                const totalVisible = Math.min(visibleCount, reviews.length);
                const isFeatured = totalVisible >= 3 && index === Math.floor(totalVisible / 2);

                // Single review - centered and larger
                if (totalVisible === 1) {
                  return (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 border-2 border-indigo-400/30 shadow-2xl shadow-indigo-500/20"
                    >
                      <div className="flex items-center justify-center gap-1 mb-4">
                        <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                          ⭐ Customer Review
                        </span>
                      </div>
                      <div className="flex gap-2 mb-5 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < review.rating
                                ? "fill-yellow-300 text-yellow-300"
                                : "text-white/30"
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-base sm:text-lg text-white/95 mb-6 leading-relaxed text-center italic">
                        &ldquo;{review.reviewText}&rdquo;
                      </p>
                      <div className="flex items-center justify-center gap-4 pt-5 border-t border-white/20">
                        {review.userProfilePic ? (
                          <img
                            src={review.userProfilePic}
                            alt={review.userName}
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-white/30"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-xl">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="text-left">
                          <div className="font-bold text-white">{review.userName}</div>
                          <div className="text-xs text-indigo-100">{review.userEmail}</div>
                          <div className="text-[10px] text-indigo-200">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Featured review (middle of 3+) - larger
                if (isFeatured) {
                  return (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="sm:col-span-2 lg:col-span-1 lg:col-start-2 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 border-2 border-indigo-400/30 shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-center gap-1 mb-4">
                        <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                          ⭐ Featured Review
                        </span>
                      </div>
                      <div className="flex gap-2 mb-5 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < review.rating
                                ? "fill-yellow-300 text-yellow-300"
                                : "text-white/30"
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-base sm:text-lg text-white/95 mb-6 leading-relaxed text-center italic">
                        &ldquo;{review.reviewText}&rdquo;
                      </p>
                      <div className="flex items-center justify-center gap-4 pt-5 border-t border-white/20">
                        {review.userProfilePic ? (
                          <img
                            src={review.userProfilePic}
                            alt={review.userName}
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-white/30"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-xl">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="text-left">
                          <div className="font-bold text-white">{review.userName}</div>
                          <div className="text-xs text-indigo-100">{review.userEmail}</div>
                          <div className="text-[10px] text-indigo-200">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Regular review card
                return (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/50"
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/80 mb-4 leading-relaxed line-clamp-4">
                      &ldquo;{review.reviewText}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-border">
                      {review.userProfilePic ? (
                        <img
                          src={review.userProfilePic}
                          alt={review.userName}
                          className="h-10 w-10 rounded-full object-cover flex-shrink-0 ring-2 ring-border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm truncate">{review.userName}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {visibleCount < reviews.length && (
              <div className="text-center mt-8 sm:mt-10">
                <Button
                  onClick={showMore}
                  variant="outline"
                  size="lg"
                  className="rounded-lg px-6 sm:px-8"
                >
                  Show More ({reviews.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <CheckCircle className="h-14 w-14 sm:h-20 sm:w-20 mx-auto text-indigo-600 mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 px-2">No Reviews Yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-2">
              Be the first to share your experience with AI Event Organizer! Your review helps others discover our platform.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
