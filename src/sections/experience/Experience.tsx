import { Container } from "../../components/ui/Container.tsx";
import { Section } from "../../components/ui/Section.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { Timeline } from "./Timeline.tsx";

export function Experience() {
  const { t } = useLanguage();

  return (
    <Section id="journey" className="overflow-x-clip">
      <Container>
        <h2 className="text-h1 font-bold text-center mb-[var(--space-12)]">
          {t.nav.journey}
        </h2>
        <Timeline />
      </Container>
    </Section>
  );
}
