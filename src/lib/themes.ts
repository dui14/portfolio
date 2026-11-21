export type Theme = {
  id: string;
  name: string;
  background: string;
  text: string;
  accent: string;
  onAccent: string;
};
  
export const themes: Theme[] = [
  {
    id: "warm-editorial",
    name: "Warm Editorial",
    background: "#F4EFEA",
    text: "#232323",
    accent: "#C84B31",
    onAccent: "#FFFFFF",
  },
  {
    id: "sage-minimalist",
    name: "Sage Minimalist",
    background: "#F4F6F0",
    text: "#1C2321",
    accent: "#7D907C",
    onAccent: "#000000",
  },
  {
    id: "nordic-calm",
    name: "Nordic Calm",
    background: "#F0F3F5",
    text: "#1E252B",
    accent: "#3A6073",
    onAccent: "#FFFFFF",
  },
  {
    id: "deep-charcoal",
    name: "Deep Charcoal",
    background: "#1A1A1A",
    text: "#EAE5DE",
    accent: "#E07A5F",
    onAccent: "#000000",
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    background: "#11161B",
    text: "#E2E8F0",
    accent: "#64B5F6",
    onAccent: "#000000",
  },
];