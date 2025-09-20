import { Navigation } from "@/components/navigation";
import { AboutHero } from "@/components/about-hero";
import { ProblemSolution } from "@/components/problem-solution";

import { CompanyValues } from "@/components/company-values";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <AboutHero />
      <ProblemSolution />
    <CompanyValues />
    </main>
  );
}
