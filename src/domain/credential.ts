export type CredentialCategoryId = "security" | "networking" | "financeWeb3";

export type CredentialImage = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
};

export type Credential = {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  expiresAt?: string;
  url: string;
  image?: CredentialImage;
};

export type CredentialGroup = {
  category: CredentialCategoryId;
  items: Credential[];
};
