import { Container } from "../../components/ui/Container.tsx";
import { Section } from "../../components/ui/Section.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { Credentials } from "./Credentials.tsx";
import { Contributions } from "./Contributions.tsx";
import { DeveloperCard } from "./DeveloperCard.tsx";
import { IntroCard } from "./IntroCard.tsx";
import { Life } from "./Life.tsx";

export function About() {
  const { t } = useLanguage();

  return (
    <Section id="about">
      <Container>
        <h2 className="sr-only">{t.about.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-[var(--space-6)]">
          <Life />
          <IntroCard />
          <Credentials />
          <DeveloperCard />
          <Contributions />
        </div>
      </Container>
    </Section>
  );
}
