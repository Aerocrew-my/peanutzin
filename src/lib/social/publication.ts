export const SOCIAL_PLATFORMS = ["facebook", "instagram", "linkedin", "threads"] as const;
export type PublishPlatform = typeof SOCIAL_PLATFORMS[number];

export function isPublishPlatform(value: string): value is PublishPlatform {
  return SOCIAL_PLATFORMS.includes(value as PublishPlatform);
}

export function platformCopy(draft: Record<string, unknown>, platform: PublishPlatform) {
  const value = draft[`${platform}_copy`];
  return typeof value === "string" ? value.trim() : "";
}

export function socialPayload(input: { publicationId:string; attemptReference:string; draftId:string; platform:PublishPlatform; copy:string; hashtags?:string|null; sourceUrl?:string|null; mediaUrl?:string|null }) {
  return { publication_id:input.publicationId, attempt_reference:input.attemptReference, social_draft_id:input.draftId, platform:input.platform, copy:input.copy, hashtags:input.hashtags||undefined, source_url:input.sourceUrl||undefined, media_url:input.mediaUrl||undefined };
}

export const PLATFORM_URLS:Record<PublishPlatform,string>={facebook:"https://www.facebook.com/",instagram:"https://www.instagram.com/",linkedin:"https://www.linkedin.com/feed/",threads:"https://www.threads.net/"};
