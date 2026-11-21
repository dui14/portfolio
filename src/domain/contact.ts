export type ContactError = "network" | "validation" | "rate_limit" | "server";

export type ContactResult = { ok: true } | { ok: false; error: ContactError };

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

export type ContactFieldCode =
  | "nameRequired"
  | "nameTooLong"
  | "emailRequired"
  | "emailInvalid"
  | "messageRequired"
  | "messageTooShort"
  | "messageTooLong";

export type ContactFieldErrors = Partial<
  Record<keyof ContactMessage, ContactFieldCode>
>;

export const CONTACT_LIMITS = {
  nameMin: 1,
  nameMax: 80,
  messageMin: 10,
  messageMax: 1000,
} as const;

export function validateContactMessage(
  message: ContactMessage
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!message.name.trim()) {
    errors.name = "nameRequired";
  } else if (message.name.length > CONTACT_LIMITS.nameMax) {
    errors.name = "nameTooLong";
  }

  if (!message.email.trim()) {
    errors.email = "emailRequired";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.email)) {
    errors.email = "emailInvalid";
  }

  if (!message.message.trim()) {
    errors.message = "messageRequired";
  } else if (message.message.length < CONTACT_LIMITS.messageMin) {
    errors.message = "messageTooShort";
  } else if (message.message.length > CONTACT_LIMITS.messageMax) {
    errors.message = "messageTooLong";
  }

  return errors;
}
