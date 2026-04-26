import type { UserConfigUpdatePayload } from "@/services/requests/company-configs/types";
import { sessionLogin, sessionLogout, sessionMe } from "@/features/session/http/mutations/sessionMutations";
import { googleAuthenticate, googleCompleteRegistration, type GoogleNeedsCompanyInfo, type GoogleCompleteRegistrationPayload } from "@/features/session/http/mutations/googleMutations";
import type { LoginResponse } from "@/features/session/types";
import { api } from "@/services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createContext, useCallback, useContext } from "react";
import { toast } from "react-hot-toast";

type LoginPayload = {
  username: string;
  password: string;
};

type SessionContextType = {
  session:
    | {
        user: LoginResponse["user"];
        isAuthenticated: true;
      }
    | {
        user: null;
        isAuthenticated: false;
      };
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<GoogleNeedsCompanyInfo | null>;
  completeGoogleRegistration: (payload: GoogleCompleteRegistrationPayload) => Promise<void>;
  logout: () => void;
  isAuthenticating: boolean;
  updateUserConfig: (
    config: UserConfigUpdatePayload,
    callApi?: boolean,
  ) => Promise<void>;
  can: (permission: string) => boolean;
  cannot: (permission: string) => boolean;
};

export const SessionContext = createContext<SessionContextType>(
  null as unknown as SessionContextType,
);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: () => sessionMe(),
    retry(_failureCount, error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        localStorage.removeItem("is_authenticated");
        return false;
      }

      return true;
    },
    enabled: localStorage.getItem("is_authenticated") === "true",
  });

  const login = async (payload: LoginPayload) => {
    try {
      const response = await sessionLogin(payload);
      localStorage.setItem("is_authenticated", "true");
      queryClient.setQueryData(["session"], response);
    } catch (error) {
      toast.error("Usuário ou senha inválidos");
    }
  };

  const loginWithGoogle = async (accessToken: string): Promise<GoogleNeedsCompanyInfo | null> => {
    try {
      const response = await googleAuthenticate(accessToken);
      if ("needs_company_info" in response && response.needs_company_info) {
        return response as GoogleNeedsCompanyInfo;
      }
      localStorage.setItem("is_authenticated", "true");
      queryClient.setQueryData(["session"], response);
      return null;
    } catch (error) {
      toast.error("Erro ao autenticar com Google");
      return null;
    }
  };

  const completeGoogleRegistration = async (payload: GoogleCompleteRegistrationPayload) => {
    try {
      const response = await googleCompleteRegistration(payload);
      localStorage.setItem("is_authenticated", "true");
      queryClient.setQueryData(["session"], response);
    } catch (error) {
      toast.error("Erro ao criar conta");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await sessionLogout();
      localStorage.removeItem("is_authenticated");
      queryClient.setQueryData(["session"], null);
      window.location.href = "/login";
    } catch (error) {
      toast.error("Erro ao sair");
    }
  };

  const updateUserConfig = async (
    config: UserConfigUpdatePayload,
    callApi: boolean = true,
  ) => {
    try {
      if (callApi) {
        await api.put("/api/company_configs", config);
      }
      const queryData = queryClient.getQueryData(["session"]);

      if (queryData) {
        queryClient.setQueryData(
          ["session"],
          (old: LoginResponse): LoginResponse => {
            return {
              ...old,
              user: {
                ...old.user,
                config: {
                  ...old.user.config,
                  productPercentageVariation:
                    config.product_percentage_variation,
                },
              },
            };
          },
        );
      }
    } catch (error) {
      toast.error("Erro ao atualizar configuração");
    }
  };

  const can = useCallback(
    (permission: string): boolean => {
      if (!session?.user) return false;
      if (session.user.role === null) return true;
      return session.user.permissions.includes(permission);
    },
    [session],
  );

  const cannot = useCallback((permission: string) => !can(permission), [can]);

  return (
    <SessionContext.Provider
      value={{
        session: session
          ? { user: session.user, isAuthenticated: true }
          : { user: null, isAuthenticated: false },
        login,
        loginWithGoogle,
        completeGoogleRegistration,
        logout,
        isAuthenticating: isLoading,
        updateUserConfig,
        can,
        cannot,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }

  return context;
};
