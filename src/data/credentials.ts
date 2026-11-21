import type {
  Credential,
  CredentialGroup,
  CredentialImage,
} from "../domain/credential.ts";
import { getImage } from "./media.ts";

const CREDLY_BADGE_URL = "https://www.credly.com/badges/";
const BINANCE_CERTIFICATE_URL =
  "https://www.binance.com/en/academy/courses/certificate/";
const BINANCE_ISSUER = "Binance Academy";
const FORTINET = "Fortinet";
const CISCO = "Cisco";

function resolveImage(mediaKey?: string): CredentialImage | undefined {
  if (!mediaKey) return undefined;
  const media = getImage(mediaKey);
  if (!media) return undefined;
  return {
    src: media.src,
    srcSet: media.srcSet,
    width: media.width,
    height: media.height,
  };
}

function badge(
  id: string,
  mediaKey: string,
  title: string,
  issuer: string,
  issuedAt: string,
  expiresAt?: string,
): Credential {
  return {
    id,
    title,
    issuer,
    issuedAt,
    expiresAt,
    url: `${CREDLY_BADGE_URL}${id}`,
    image: resolveImage(`badges/${mediaKey}`),
  };
}

function certificate(
  id: string,
  title: string,
  issuer: string,
  issuedAt: string,
  url: string,
  mediaKey?: string,
): Credential {
  return {
    id,
    title,
    issuer,
    issuedAt,
    url,
    image: resolveImage(mediaKey && `certifications/${mediaKey}`),
  };
}

const FCA_ID = "a4d9f648-fbda-4859-b07f-237fbc63579d";
const FCF_ID = "07ddd0f1-837f-4407-ab22-23b47e63e323";

export const badgeGroups: CredentialGroup[] = [
  {
    category: "security",
    items: [
      badge(
        FCA_ID,
        "fortinet-certified-associate-cybersecurity",
        "Fortinet Certified Associate Cybersecurity",
        FORTINET,
        "2026-07-10",
        "2028-07-10",
      ),
      badge(
        FCF_ID,
        "fortinet-certified-fundamentals-cybersecurity",
        "Fortinet Certified Fundamentals Cybersecurity",
        FORTINET,
        "2026-07-04",
        "2028-07-10",
      ),
      badge(
        "482fa6b0-f97f-49b6-a410-cbd8e0f2fddd",
        "fortinet-nse-3-certified-in-cybersecurity",
        "Fortinet NSE 3 Certified in Cybersecurity",
        FORTINET,
        "2026-07-10",
        "2028-07-10",
      ),
      badge(
        "b578b702-82d1-49ea-8e81-99bc7986c2e1",
        "fortinet-nse-2-certified-in-cybersecurity",
        "Fortinet NSE 2 Certified in Cybersecurity",
        FORTINET,
        "2026-07-04",
        "2028-07-10",
      ),
      badge(
        "6095a387-267b-4117-8b75-ba0449d34ab1",
        "fortinet-nse-1-certified-in-cybersecurity",
        "Fortinet NSE 1 Certified in Cybersecurity",
        FORTINET,
        "2026-07-04",
        "2028-07-10",
      ),
      badge(
        "02cf5634-20cf-4b24-becd-da1bdfc34e0e",
        "introduction-to-the-threat-landscape-3-0",
        "Introduction to the Threat Landscape 3.0",
        FORTINET,
        "2026-07-04",
      ),
      badge(
        "d3fb0910-e91d-4355-8325-7bfd9db2837f",
        "technical-introduction-to-cybersecurity-3-0",
        "Technical Introduction to Cybersecurity 3.0",
        FORTINET,
        "2026-07-04",
      ),
      badge(
        "3f982e72-b824-4477-932a-811aec1c380b",
        "cisco-network-defense",
        "Network Defense",
        CISCO,
        "2026-07-09",
      ),
      badge(
        "cd0b66ee-670c-461f-a9f8-ad12d6babc09",
        "cisco-introduction-to-cybersecurity",
        "Introduction to Cybersecurity",
        CISCO,
        "2026-07-03",
      ),
    ],
  },
  {
    category: "networking",
    items: [
      badge(
        "800b009b-0980-4d7c-84c9-b52dcc98af73",
        "fortinet-fortigate-7-6-operator",
        "Fortinet FortiGate 7.6 Operator",
        FORTINET,
        "2026-07-10",
      ),
      badge(
        "8ca6f03c-d694-4e07-b816-c32285410221",
        "cisco-networking-basics",
        "Networking Basics",
        CISCO,
        "2026-07-09",
      ),
    ],
  },
];

export const certificationGroups: CredentialGroup[] = [
  {
    category: "security",
    items: [
      certificate(
        "fortinet-certified-associate-cybersecurity",
        "Fortinet Certified Associate Cybersecurity",
        FORTINET,
        "2026-07-10",
        `${CREDLY_BADGE_URL}${FCA_ID}`,
        "fortinet-certified-associate-cybersecurity-certificate",
      ),
      certificate(
        "fortinet-certified-fundamentals-cybersecurity",
        "Fortinet Certified Fundamentals Cybersecurity",
        FORTINET,
        "2026-07-04",
        `${CREDLY_BADGE_URL}${FCF_ID}`,
        "fortinet-certified-fundamentals-cybersecurity-certificate",
      ),
    ],
  },
  {
    category: "financeWeb3",
    items: [
      certificate(
        "binance-ai-unlocked-agents-and-skills",
        "AI Unlocked: Agents and Skills",
        BINANCE_ISSUER,
        "2026-11-19",
        `${BINANCE_CERTIFICATE_URL}ce90ec46755f4ae3ded54b9723219d59f1632654f9d4bc23a9044d2983d37944`,
        "binance-academy-ai-unlocked-agents-and-skills-certificate",
      ),
      certificate(
        "binance-tradfi-products-on-binance",
        "TradFi Products on Binance",
        BINANCE_ISSUER,
        "2026-11-19",
        `${BINANCE_CERTIFICATE_URL}ff367dc130ab0896772f9c4d89e04c9f467e35df7b806a54dcae8559d1fc60b8`,
        "binance-academy-tradfi-products-on-binance-certificate",
      ),
      certificate(
        "binance-understanding-bonds",
        "Understanding Bonds",
        BINANCE_ISSUER,
        "2026-10-18",
        `${BINANCE_CERTIFICATE_URL}51b303c20662d6f33914a1c75ac58c4caed4a3d8df9d30a1e9232dc7569394dc`,
        "binance-academy-understanding-bonds-certificate",
      ),
      certificate(
        "binance-understanding-stocks",
        "Understanding Stocks",
        BINANCE_ISSUER,
        "2026-10-03",
        `${BINANCE_CERTIFICATE_URL}e19071c7212916204703d6031d8f99a97368f786642d9b4b1dbffbfc91ad25e6`,
        "binance-academy-understanding-stocks-certificate",
      ),
      certificate(
        "binance-from-tradfi-to-crypto",
        "From TradFi to Crypto",
        BINANCE_ISSUER,
        "2026-09-17",
        `${BINANCE_CERTIFICATE_URL}3ddc5001e0eb1ba419fc06295d297f98e3e3300a20c45c9ff48419e0d234965b`,
        "binance-academy-from-tradfi-to-crypto-certificate",
      ),
    ],
  },
];
