import { Container } from "../../components/ui/Container.tsx";
import { Section } from "../../components/ui/Section.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { ProjectGrid } from "./ProjectGrid.tsx";

export function Projects() {
  const { t } = useLanguage();

  return (
    <Section id="projects">
      <Container>
        <h2 className="text-h1 font-bold text-center mb-[var(--space-12)]">
          {t.projects.title}
        </h2>
        <ProjectGrid />
      </Container>
    </Section>
  );
}
