import { useLanguage } from "../../context/useLanguage.ts";
import { developer } from "../../data/skills.ts";
import { socials } from "../../data/socials.ts";
import { routeHref, routes } from "../../data/routes.ts";
import { AppLink } from "../../components/ui/AppLink.tsx";
import { Container } from "../../components/ui/Container.tsx";
import { socialIcons } from "../../lib/icons.tsx";
import { externalLinkProps } from "../../lib/links.ts";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[var(--border)] py-[var(--space-16)]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-12)]">
          <div>
            <h2 className="text-h3 font-bold mb-[var(--space-4)]">
              {t.footer.aboutTitle}
            </h2>
            <p className="text-sm text-[var(--muted)]">{t.footer.aboutText}</p>
          </div>

          <div>
            <h2 className="text-h3 font-bold mb-[var(--space-4)]">
              {t.footer.quickLinks}
            </h2>
            <ul>
              {routes.map((route) => (
                <li key={route.id}>
                  <AppLink
                    href={routeHref(route)}
                    className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-[var(--dur-fast)]"
                  >
                    {t.nav[route.id as keyof typeof t.nav] ?? route.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-h3 font-bold mb-[var(--space-4)]">
              {t.footer.connect}
            </h2>
            <div className="flex flex-wrap gap-[var(--space-3)]">
              {socials.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    {...externalLinkProps(social.href)}
                    aria-label={social.label}
                    className="p-[var(--space-2)] rounded-[var(--radius-md)] text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-all duration-[var(--dur-fast)]"
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-[var(--space-12)] pt-[var(--space-8)] border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} {developer.name}. {t.footer.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}
