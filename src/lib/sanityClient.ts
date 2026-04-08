import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

// Sanity configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-01-01";
const token = process.env.SANITY_API_TOKEN;
const useCdn = process.env.NODE_ENV === "production";

// Only create client if project ID is provided
const isConfigured = projectId && projectId.length > 0;

export const client = createClient({
  projectId: projectId || "demo",
  dataset,
  apiVersion,
  useCdn,
  token,
});

export const previewClient = createClient({
  projectId: projectId || "demo",
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

// Image URL helper
const builder = createImageUrlBuilder({ projectId: projectId || "demo", dataset });

export function urlFor(source: any) {
  return builder.image(source);
}

// Check if Sanity is configured
export function isSanityConfigured(): boolean {
  return Boolean(isConfigured);
}
