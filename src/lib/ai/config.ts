import "server-only";

export const AI_CONFIG = {
  model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
  endpoint: "https://api.openai.com/v1/responses",
  timeoutMs: 30_000,
  maxOutputTokens: 1800,
  maxBriefChars: 12_000,
  maxArticleChars: 18_000,
  maxToneChars: 1_000,
} as const;

export const isAiConfigured = () => Boolean(process.env.OPENAI_API_KEY?.trim());
