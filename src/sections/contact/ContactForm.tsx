import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "../../components/ui/Button.tsx";
import { Field } from "../../components/ui/Field.tsx";
import { GlassPanel } from "../../components/ui/GlassPanel.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { CONTACT_LIMITS } from "../../domain/contact.ts";
import { useContactForm } from "../../features/contact/useContactForm.ts";
import { useScrollReveal } from "../../hooks/useScrollReveal.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { revealVariants } from "../../lib/motion.ts";

const COUNTER_ANNOUNCE_REMAINING = 50;

type SuccessPanelProps = {
  title: string;
  text: string;
  action: string;
  onAction: () => void;
};

function SuccessPanel({ title, text, action, onAction }: SuccessPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <GlassPanel className="p-[var(--space-8)] text-center">
      <div
        ref={panelRef}
        role="status"
        tabIndex={-1}
        className="focus:outline-none"
      >
        <CheckCircle className="w-16 h-16 text-[var(--accent)] mx-auto mb-[var(--space-4)]" />
        <h3 className="text-h2 font-bold mb-[var(--space-2)]">{title}</h3>
        <p className="text-base text-[var(--muted)] mb-[var(--space-6)]">
          {text}
        </p>
      </div>
      <Button variant="ghost" onClick={onAction}>
        {action}
      </Button>
    </GlassPanel>
  );
}

export function ContactForm() {
  const { ref, isInView } = useScrollReveal();
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();
  const {
    values,
    errors,
    submitError,
    status,
    honeypot,
    setHoneypot,
    setField,
    submit,
    reset,
  } = useContactForm();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submit();
  }

  const remaining = CONTACT_LIMITS.messageMax - values.message.length;
  const announceCounter = remaining <= COUNTER_ANNOUNCE_REMAINING;

  if (status === "success") {
    return (
      <motion.div
        ref={ref as never}
        variants={reducedMotion ? undefined : revealVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <SuccessPanel
          title={t.contact.successTitle}
          text={t.contact.successText}
          action={t.contact.sendAnother}
          onAction={reset}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref as never}
      variants={reducedMotion ? undefined : revealVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <GlassPanel className="p-[var(--space-8)]">
        <h3 className="text-h2 font-bold mb-[var(--space-2)]">
          {t.contact.formTitle}
        </h3>
        <p className="text-base text-[var(--muted)] mb-[var(--space-6)]">
          {t.contact.formSubtitle}
        </p>

        {status === "error" && submitError && (
          <div
            className="flex items-start gap-[var(--space-3)] p-[var(--space-4)] rounded-[var(--radius-md)] bg-[var(--accent-soft)] border border-[var(--accent)] mb-[var(--space-6)]"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--accent)]">{submitError}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="relative space-y-[var(--space-6)]"
        >
          <div
            inert
            className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none"
          >
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
            />
          </div>

          <Field
            label={t.contact.name}
            name="name"
            value={values.name}
            onChange={(value) => setField("name", value)}
            error={errors.name}
            placeholder={t.contact.namePlaceholder}
            autoComplete="name"
            required
          />

          <Field
            label={t.contact.email}
            name="email"
            type="email"
            value={values.email}
            onChange={(value) => setField("email", value)}
            error={errors.email}
            placeholder={t.contact.emailPlaceholder}
            autoComplete="email"
            required
          />

          <div>
            <Field
              label={t.contact.message}
              name="message"
              value={values.message}
              onChange={(value) => setField("message", value)}
              error={errors.message}
              placeholder={t.contact.messagePlaceholder}
              multiline
              required
            />
            <p
              className={`text-xs mt-[var(--space-2)] text-right ${
                remaining < 0 ? "text-[var(--accent)]" : "text-[var(--muted)]"
              }`}
              aria-live={announceCounter ? "polite" : "off"}
            >
              {values.message.length} / {CONTACT_LIMITS.messageMax}
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={status === "loading"}
            className="w-full"
          >
            {status === "loading" ? (
              <>{t.contact.sending}</>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t.contact.send}
              </>
            )}
          </Button>
        </form>
      </GlassPanel>
    </motion.div>
  );
}
