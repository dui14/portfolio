import { Container } from "../../components/ui/Container.tsx";
import { Section } from "../../components/ui/Section.tsx";
import { HeroLeft } from "./HeroLeft.tsx";
import { HeroRight } from "./HeroRight.tsx";

export function Hero() {
  return (
    <Section id="home" className="min-h-screen flex items-center pt-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-12)] items-center">
          <HeroLeft />
          <HeroRight />
        </div>
      </Container>
    </Section>
  );
}
