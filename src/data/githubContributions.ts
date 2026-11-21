import { siteConfig } from "../config/site.ts";

export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type ContributionRange = {
  id: string;
  total: number;
  weeks: ContributionDay[][];
};

export type ContributionData = {
  user: string;
  fetchedAt: string;
  ranges: ContributionRange[];
};

export async function loadGithubContributions(): Promise<ContributionData> {
  const module = await import("./githubContributions.json");
  const data = module.default as ContributionData;
  return {
    ...data,
    ranges: data.ranges.filter(
      (range) => !/^\d{4}$/.test(range.id) || Number(range.id) >= siteConfig.contributionsFirstYear,
    ),
  };
}
