import { useState } from "react";

import type {
  ContactError,
  ContactFieldErrors,
  ContactMessage,
} from "../../domain/contact.ts";
import { validateContactMessage } from "../../domain/contact.ts";
import { useLanguage } from "../../context/useLanguage.ts";
import { submitContactMessage } from "../../services/contactService.ts";

export type ContactStatus = "idle" | "loading" | "error" | "success";

type ContactFieldMessages = Partial<Record<keyof ContactMessage, string>>;

const EMPTY_VALUES: ContactMessage = { name: "", email: "", message: "" };

export function useContactForm() {
  const { t } = useLanguage();
  const [values, setValues] = useState<ContactMessage>(EMPTY_VALUES);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<ContactFieldMessages>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<ContactStatus>("idle");

  const submitMessages: Record<ContactError, string> = {
    network: t.contact.errors.network,
    rate_limit: t.contact.errors.rateLimit,
    server: t.contact.errors.server,
    validation: t.contact.errors.invalid,
  };

  function translateFieldErrors(
    fieldErrors: ContactFieldErrors
  ): ContactFieldMessages {
    const messages: ContactFieldMessages = {};

    for (const key of Object.keys(fieldErrors) as (keyof ContactMessage)[]) {
      const code = fieldErrors[key];
      if (code) messages[key] = t.contact.errors[code];
    }

    return messages;
  }

  function setField(field: keyof ContactMessage, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function submit() {
    setStatus("loading");
    setErrors({});
    setSubmitError(null);

    const validationErrors = validateContactMessage(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(translateFieldErrors(validationErrors));
      setStatus("idle");
      return;
    }

    const result = await submitContactMessage(values, honeypot);

    if (result.ok) {
      setStatus("success");
      setValues(EMPTY_VALUES);
      setHoneypot("");
    } else {
      setStatus("error");
      setSubmitError(submitMessages[result.error]);
    }
  }

  function reset() {
    setValues(EMPTY_VALUES);
    setHoneypot("");
    setErrors({});
    setSubmitError(null);
    setStatus("idle");
  }

  return {
    values,
    errors,
    submitError,
    status,
    honeypot,
    setHoneypot,
    setField,
    submit,
    reset,
  };
}
