import { api } from "@/services/api";
import type { LoginResponse } from "../../types";

export type GoogleNeedsCompanyInfo = {
  needs_company_info: true;
  google_data: {
    google_uid: string;
    email: string;
    name: string;
  };
};

export type GoogleAuthResponse = LoginResponse | GoogleNeedsCompanyInfo;

export type GoogleCompleteRegistrationPayload = {
  company_name: string;
  cnpj: string;
  name: string;
  email: string;
  google_uid: string;
};

export const googleAuthenticate = (accessToken: string) =>
  api.post<GoogleAuthResponse>("/api/auth/google", { access_token: accessToken });

export const googleCompleteRegistration = (data: GoogleCompleteRegistrationPayload) =>
  api.post<LoginResponse>("/api/auth/google/complete", { google_registration: data });
