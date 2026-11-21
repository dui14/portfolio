export type SkillGroups = {
  programming: string[];
  frameworks: string[];
  tools: string[];
};

export type DeveloperProfile = {
  name: string;
  role: string;
  skills: SkillGroups;
  hardWorker: boolean;
  quickLearner: boolean;
  isHandsome: boolean;
};

export const developer: DeveloperProfile = {
  name: "Khang Luong",
  role: "Software Engineer",
  skills: {
    programming: ["JavaScript", "TypeScript", "Python"],
    frameworks: ["Node.js", "Next.js", "React"],
    tools: ["Git", "Cursor", "AI Integration"],
  },
  hardWorker: true,
  quickLearner: true,
  isHandsome: true,
};
