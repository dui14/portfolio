import { Container } from "../../components/ui/Container.tsx";
import { Section } from "../../components/ui/Section.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { ContactForm } from "./ContactForm.tsx";

export function Contact() {
  const { t } = useLanguage();

  return (
    <Section id="contact">
      <Container>
        <h2 className="text-h1 font-bold text-center mb-[var(--space-12)]">
          {t.contact.title}
        </h2>

        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
