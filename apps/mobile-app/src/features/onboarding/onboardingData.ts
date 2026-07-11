export type OnboardingItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  secondaryAccent: string;
};

export const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    eyebrow: "SMART VEHICLE CARE",
    title: "Your Car Deserves Better Care",
    description:
      "Book trusted automobile services, select premium service packages, and manage every vehicle from one place.",
    icon: "🚘",
    accent: "#C90000",
    secondaryAccent: "#FDECEC",
  },
  {
    id: "2",
    eyebrow: "LIVE SERVICE UPDATES",
    title: "Track Every Step With Confidence",
    description:
      "Follow your booking, live job card progress, inspection updates, photos, and videos directly from the app.",
    icon: "🛠️",
    accent: "#D4AF37",
    secondaryAccent: "#FFF7D6",
  },
  {
    id: "3",
    eyebrow: "SAFE & TRANSPARENT",
    title: "Invoices and Payments Made Simple",
    description:
      "View detailed invoices, verify service charges, and complete secure online payments without any confusion.",
    icon: "✓",
    accent: "#111111",
    secondaryAccent: "#F1F1F1",
  },
];
