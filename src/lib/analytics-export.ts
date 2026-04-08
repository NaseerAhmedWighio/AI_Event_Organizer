/**
 * Analytics Data Export Utilities
 * Functions for exporting analytics data to CSV and PDF formats
 */

import { AnalyticsStats, MonthlyData, CategoryData, StatusData, CategoryPerformance } from "@/hooks/useAnalytics";

/**
 * Export analytics stats to CSV format
 */
export function exportStatsToCSV(stats: AnalyticsStats, filename: string = "analytics-stats.csv"): void {
  const headers = ["Metric", "Value"];
  const rows = [
    ["Total Events", stats.totalEvents.toString()],
    ["Upcoming Events", stats.upcomingEvents.toString()],
    ["Completed Events", stats.completedEvents.toString()],
    ["Cancelled Events", stats.cancelledEvents.toString()],
    ["Total Attendees", stats.totalAttendees.toString()],
    ["Total AI Plans", stats.totalAIPlans.toString()],
    ["This Month Events", stats.thisMonthEvents.toString()],
    ["Average Attendees", stats.averageAttendees.toString()],
  ];

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
}

/**
 * Export monthly data to CSV format
 */
export function exportMonthlyDataToCSV(
  monthlyData: MonthlyData[],
  filename: string = "monthly-events.csv"
): void {
  const headers = ["Month", "Total Events", "Upcoming", "Completed"];
  const rows = monthlyData.map((data) => [
    data.name,
    data.events.toString(),
    data.upcoming.toString(),
    data.completed.toString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
}

/**
 * Export category performance to CSV format
 */
export function exportCategoryPerformanceToCSV(
  categoryPerformance: CategoryPerformance[],
  filename: string = "category-performance.csv"
): void {
  const headers = ["Category", "Total", "Completed", "Upcoming", "Cancelled", "Completion Rate (%)"];
  const rows = categoryPerformance.map((data) => [
    data.category,
    data.total.toString(),
    data.completed.toString(),
    data.upcoming.toString(),
    data.cancelled.toString(),
    data.completionRate.toString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
}

/**
 * Export all analytics data to a comprehensive CSV
 */
export function exportAllAnalyticsToCSV(
  stats: AnalyticsStats | null,
  monthlyData: MonthlyData[],
  categoryData: CategoryData[],
  statusData: StatusData[],
  categoryPerformance: CategoryPerformance[],
  filename: string = "complete-analytics-report.csv"
): void {
  let csvContent = "ANALYTICS REPORT\nGenerated: " + new Date().toLocaleString() + "\n\n";

  // Stats section
  if (stats) {
    csvContent += "=== SUMMARY STATISTICS ===\n";
    csvContent += "Metric,Value\n";
    csvContent += `Total Events,"${stats.totalEvents}"\n`;
    csvContent += `Upcoming Events,"${stats.upcomingEvents}"\n`;
    csvContent += `Completed Events,"${stats.completedEvents}"\n`;
    csvContent += `Cancelled Events,"${stats.cancelledEvents}"\n`;
    csvContent += `Total Attendees,"${stats.totalAttendees}"\n`;
    csvContent += `Average Attendees,"${stats.averageAttendees}"\n`;
    csvContent += `This Month Events,"${stats.thisMonthEvents}"\n`;
    csvContent += `Total AI Plans,"${stats.totalAIPlans}"\n\n`;
  }

  // Monthly data section
  csvContent += "=== MONTHLY EVENTS ===\n";
  csvContent += "Month,Total,Upcoming,Completed\n";
  monthlyData.forEach((data) => {
    csvContent += `"${data.name}","${data.events}","${data.upcoming}","${data.completed}"\n`;
  });
  csvContent += "\n";

  // Category data section
  csvContent += "=== CATEGORY DISTRIBUTION ===\n";
  csvContent += "Category,Count,Percentage\n";
  categoryData.forEach((data) => {
    csvContent += `"${data.name}","${data.value}","${data.percentage}%"\n`;
  });
  csvContent += "\n";

  // Status data section
  csvContent += "=== STATUS DISTRIBUTION ===\n";
  csvContent += "Status,Count,Percentage\n";
  statusData.forEach((data) => {
    csvContent += `"${data.name}","${data.value}","${data.percentage}%"\n`;
  });
  csvContent += "\n";

  // Category performance section
  csvContent += "=== CATEGORY PERFORMANCE ===\n";
  csvContent += "Category,Total,Completed,Upcoming,Cancelled,Completion Rate\n";
  categoryPerformance.forEach((data) => {
    csvContent += `"${data.category}","${data.total}","${data.completed}","${data.upcoming}","${data.cancelled}","${data.completionRate}%"\n`;
  });

  downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
}

/**
 * Helper function to download file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Print analytics page
 */
export function printAnalytics(): void {
  window.print();
}

/**
 * Generate a simple text report
 */
export function generateTextReport(
  stats: AnalyticsStats | null,
  monthlyData: MonthlyData[],
  categoryPerformance: CategoryPerformance[]
): string {
  let report = "AI EVENT ORGANIZER - ANALYTICS REPORT\n";
  report += "=".repeat(50) + "\n";
  report += `Generated: ${new Date().toLocaleString()}\n\n`;

  if (stats) {
    report += "SUMMARY\n";
    report += "-".repeat(50) + "\n";
    report += `Total Events: ${stats.totalEvents}\n`;
    report += `Upcoming Events: ${stats.upcomingEvents}\n`;
    report += `Completed Events: ${stats.completedEvents}\n`;
    report += `Cancelled Events: ${stats.cancelledEvents}\n`;
    report += `Total Attendees: ${stats.totalAttendees}\n`;
    report += `Average Attendees per Event: ${stats.averageAttendees}\n`;
    report += `Events This Month: ${stats.thisMonthEvents}\n`;
    report += `AI Plans Generated: ${stats.totalAIPlans}\n\n`;
  }

  report += "MONTHLY TREND\n";
  report += "-".repeat(50) + "\n";
  monthlyData.forEach((data) => {
    report += `${data.name}: ${data.events} events (${data.upcoming} upcoming, ${data.completed} completed)\n`;
  });
  report += "\n";

  if (categoryPerformance.length > 0) {
    report += "TOP PERFORMING CATEGORIES\n";
    report += "-".repeat(50) + "\n";
    categoryPerformance.slice(0, 5).forEach((data) => {
      report += `${data.category}: ${data.completionRate}% completion rate (${data.completed}/${data.total} events)\n`;
    });
  }

  return report;
}
