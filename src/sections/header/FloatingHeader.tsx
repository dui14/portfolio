import { Menu } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLanguage } from "../../context/useLanguage.ts";
import { HeaderTools } from "./HeaderTools.tsx";
import { MobileMenu } from "./MobileMenu.tsx";
import { Navigation } from "./Navigation.tsx";
import { Profile } from "./Profile.tsx";
import { SearchButton } from "./SearchButton.tsx";

const SCROLL_THRESHOLD = 8;

export function FloatingHeader() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-[var(--space-4)] top-[var(--space-4)] z-[70] -translate-y-24 rounded-[var(--radius-sm)] bg-[var(--text)] px-[var(--space-4)] py-[var(--space-3)] text-sm font-medium text-[var(--bg)] focus:translate-y-0"
      >
        {t.header.skipToContent}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-[var(--dur-bar)] ${
          scrolled ? "pt-[var(--space-3)]" : "pt-0"
        }`}
      >
        <div className="mx-auto w-full max-w-[var(--container)] px-[var(--space-2)] lg:px-[var(--space-4)]">
          <div
            className={`flex h-16 items-center justify-between gap-[var(--space-4)] rounded-[var(--radius-lg)] border px-[var(--space-4)] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[var(--dur-bar)] ${
              scrolled
                ? "border-[var(--border)] bg-[var(--glass)] shadow-[var(--shadow-sm)] backdrop-blur-md"
                : "border-transparent bg-transparent"
            }`}
          >
            <Profile />

            <div className="hidden flex-1 justify-center lg:flex">
              <Navigation />
            </div>

            <div className="hidden lg:block">
              <HeaderTools />
            </div>

            <div className="flex items-center gap-[var(--space-1)] lg:hidden">
              <SearchButton variant="icon" />
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t.header.toggleMenu}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                className="inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--surface-2)] active:scale-[0.98]"
              >
                <Menu className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && <MobileMenu onClose={closeMenu} />}
    </>
  );
}
