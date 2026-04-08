// All GROQ queries for the AI Event Organizer

// ============ EVENT QUERIES ============

// Fetch all events for a user
export const getAllEventsQuery = `
  *[_type == "event" && createdBy == $userId] | order(date desc) {
    _id,
    _createdAt,
    title,
    description,
    date,
    location,
    status,
    attendees,
    createdBy,
    budget,
    category,
    "aiPlan": *[_type == "aiPlan" && event._ref == ^._id][0] {
      _id,
      schedule,
      budget,
      suggestions,
      guestIdeas,
      checklist
    }
  }
`;

// Fetch single event by ID
export const getEventByIdQuery = `
  *[_type == "event" && _id == $eventId][0] {
    _id,
    _createdAt,
    title,
    description,
    date,
    location,
    status,
    attendees,
    createdBy,
    budget,
    category,
    "aiPlan": *[_type == "aiPlan" && event._ref == ^._id][0] {
      _id,
      schedule,
      budget,
      suggestions,
      guestIdeas,
      checklist,
      vendorRecommendations
    }
  }
`;

// Fetch upcoming events
export const getUpcomingEventsQuery = `
  *[_type == "event" && createdBy == $userId && status == "upcoming" && date > now()] | order(date asc) [0...5] {
    _id,
    title,
    description,
    date,
    location,
    attendees,
    category
  }
`;

// Fetch completed events
export const getCompletedEventsQuery = `
  *[_type == "event" && createdBy == $userId && status == "completed"] | order(date desc) [0...10] {
    _id,
    title,
    date,
    attendees,
    location
  }
`;

// Fetch events by month for analytics
export const getEventsByMonthQuery = `
  *[_type == "event" && createdBy == $userId] {
    "month": date,
    title,
    status
  }
`;

// ============ AI PLAN QUERIES ============

// Fetch AI plan for an event
export const getAIPlanForEventQuery = `
  *[_type == "aiPlan" && event._ref == $eventId][0] {
    _id,
    _createdAt,
    schedule,
    budget,
    suggestions,
    guestIdeas,
    checklist,
    vendorRecommendations,
    "event": event->{
      _id,
      title,
      date
    }
  }
`;

// ============ ANALYTICS QUERIES ============

// Event statistics - Enhanced with cancelled events and better aggregations
export const getEventStatsQuery = `
  {
    "totalEvents": count(*[_type == "event" && createdBy == $userId]),
    "upcomingEvents": count(*[_type == "event" && createdBy == $userId && status == "upcoming"]),
    "completedEvents": count(*[_type == "event" && createdBy == $userId && status == "completed"]),
    "cancelledEvents": count(*[_type == "event" && createdBy == $userId && status == "cancelled"]),
    "totalAttendees": count(*[_type == "event" && createdBy == $userId].attendees[]),
    "totalAIPlans": count(*[_type == "aiPlan" && event->createdBy == $userId]),
    "eventsByCategory": *[_type == "event" && createdBy == $userId] {
      category,
      status
    },
    "eventsByMonth": *[_type == "event" && createdBy == $userId] | order(date asc) {
      "month": date,
      "title": title,
      "status": status
    },
    "thisMonthEvents": count(*[_type == "event" && createdBy == $userId && dateTime(date).month == dateTime(now()).month && dateTime(date).year == dateTime(now()).year]),
    "averageAttendees": round(count(*[_type == "event" && createdBy == $userId].attendees[]) / count(*[_type == "event" && createdBy == $userId]))
  }
`;

// Dashboard stats
export const getDashboardStatsQuery = `
  {
    "totalEvents": count(*[_type == "event" && createdBy == $userId]),
    "upcomingEvents": count(*[_type == "event" && createdBy == $userId && status == "upcoming"]),
    "completedEvents": count(*[_type == "event" && createdBy == $userId && status == "completed"]),
    "totalAIPlans": count(*[_type == "aiPlan" && event->createdBy == $userId])
  }
`;

// ============ ENHANCED ANALYTICS QUERIES ============

// Events grouped by status for pie chart
export const getEventsByStatusQuery = `
  {
    "upcoming": count(*[_type == "event" && createdBy == $userId && status == "upcoming"]),
    "completed": count(*[_type == "event" && createdBy == $userId && status == "completed"]),
    "cancelled": count(*[_type == "event" && createdBy == $userId && status == "cancelled"])
  }
`;

// Events grouped by category with counts
export const getEventsByCategoryQuery = `
  *[_type == "event" && createdBy == $userId] {
    category,
    status
  } | groupBy(category)
`;

// Monthly event trends with status breakdown
export const getMonthlyEventTrendsQuery = `
  *[_type == "event" && createdBy == $userId] {
    "month": dateTime(date).month,
    "year": dateTime(date).year,
    status,
    category
  }
`;

// Recent activity (last 30 days)
export const getRecentActivityQuery = `
  *[_type == "event" && createdBy == $userId && dateTime(date).year == dateTime(now()).year && dateTime(date).month == dateTime(now()).month] | order(date desc) {
    _id,
    title,
    date,
    status,
    location
  }
`;

// Top categories by event count
export const getTopCategoriesQuery = `
  *[_type == "event" && createdBy == $userId && category != null] {
    category
  } | groupBy(category) | order(count() desc) [0...5]
`;

// ============ SEARCH QUERIES ============

// Search events by title or description
export const searchEventsQuery = `
  *[_type == "event" && createdBy == $userId && (title match $searchQuery || description match $searchQuery)] | order(date desc) {
    _id,
    title,
    description,
    date,
    location,
    status,
    category
  }
`;

// ============ REAL-TIME SUBSCRIPTION QUERY ============

export const eventsSubscriptionQuery = `*[_type == "event" && createdBy == $userId]`;

// ============ REVIEW QUERIES ============

// Fetch all approved reviews for landing page
export const getApprovedReviewsQuery = `
  *[_type == "review" && isApproved == true] | order(createdAt desc) [0...10] {
    _id,
    userName,
    userEmail,
    reviewText,
    rating,
    createdAt,
    "event": event->{
      _id,
      title
    }
  }
`;

// Fetch reviews for a specific event
export const getReviewsForEventQuery = `
  *[_type == "review" && isApproved == true && event._ref == $eventId] | order(createdAt desc) {
    _id,
    userName,
    userEmail,
    reviewText,
    rating,
    createdAt
  }
`;

// Fetch user's own reviews
export const getUserReviewsQuery = `
  *[_type == "review" && userId == $userId] | order(createdAt desc) {
    _id,
    reviewText,
    rating,
    createdAt,
    isApproved,
    "event": event->{
      _id,
      title
    }
  }
`;

// ============ ENHANCED ANALYTICS QUERIES (COMPUTED) ============

// Weekly event trends (last 12 weeks)
export const getWeeklyEventTrendsQuery = `
  *[_type == "event" && createdBy == $userId] {
    "week": dateTime(date).week,
    "year": dateTime(date).year,
    status,
    category
  }
`;

// Daily activity for the current month
export const getDailyActivityQuery = `
  *[_type == "event" && createdBy == $userId && dateTime(date).year == dateTime(now()).year && dateTime(date).month == dateTime(now()).month] {
    "day": dateTime(date).day,
    "month": dateTime(date).month,
    "year": dateTime(date).year,
    status,
    title
  }
`;

// Attendee growth over time
export const getAttendeeGrowthQuery = `
  *[_type == "event" && createdBy == $userId && status == "completed"] | order(date asc) {
    "date": date,
    "attendeeCount": count(attendees),
    title
  }
`;

// Category performance (completion rate by category)
export const getCategoryPerformanceQuery = `
  *[_type == "event" && createdBy == $userId && category != null] {
    category,
    status
  }
`;

// Budget vs Actual (if budget field is used)
export const getBudgetAnalysisQuery = `
  *[_type == "event" && createdBy == $userId && budget != null] {
    title,
    budget,
    status,
    category
  }
`;

// Event density by day of week
export const getDayOfWeekDistributionQuery = `
  *[_type == "event" && createdBy == $userId] {
    "dayOfWeek": dateTime(date).dayOfWeek,
    status
  }
`;

// ============ REAL-TIME SUBSCRIPTION QUERIES (OPTIMIZED) ============

// Events subscription with minimal fields for real-time updates
export const eventsRealTimeSubscriptionQuery = `*[_type == "event" && createdBy == $userId] {
  _id,
  _updatedAt,
  title,
  status,
  date
}`;

// Analytics real-time subscription (listens to any event change)
export const analyticsRealTimeSubscriptionQuery = `*[_type == "event" && createdBy == $userId] {
  _id,
  _updatedAt,
  status,
  category,
  date
}`;

// ============ USER QUERIES ============

// Fetch user profile from Sanity
export const getUserProfileQuery = `
  *[_type == "user" && userId == $userId][0] {
    _id,
    userId,
    name,
    email,
    imageUrl,
    createdAt,
    updatedAt
  }
`;

// Create or update user (upsert pattern)
export const upsertUserMutation = `
  *[_type == "user" && userId == $userId][0] {
    _id
  }
`;

// ============ SEARCH & FILTER QUERIES ============

// Advanced search with multiple filters
export const advancedSearchEventsQuery = `
  *[_type == "event" && createdBy == $userId &&
    ($search == null || title match $search || description match $search) &&
    ($status == null || status == $status) &&
    ($category == null || category == $category)
  ] | order(date desc) {
    _id,
    title,
    description,
    date,
    location,
    status,
    category,
    attendees,
    budget
  }
`;

// Filter events by date range
export const getEventsInDateRangeQuery = `
  *[_type == "event" && createdBy == $userId && date >= $startDate && date <= $endDate] | order(date asc) {
    _id,
    title,
    date,
    location,
    status,
    category
  }
`;

// Get overdue upcoming events
export const getOverdueUpcomingEventsQuery = `
  *[_type == "event" && createdBy == $userId && status == "upcoming" && date < now()] | order(date asc) {
    _id,
    title,
    date,
    location
  }
`;

// Get events happening this week
export const getThisWeekEventsQuery = `
  *[_type == "event" && createdBy == $userId && dateTime(date).week == dateTime(now()).week && dateTime(date).year == dateTime(now()).year] | order(date asc) {
    _id,
    title,
    date,
    location,
    status
  }
`;
