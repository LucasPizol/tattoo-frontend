import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";
import { BillingGate } from "./components/BillingGate";
import { Layout } from "./components/Layout";
import { LoadingScreen } from "./components/LoadingScreen";
import { Loading } from "./components/ui/Loading/index.tsx";
import { useCompanySocket } from "./context/useCompanySocket.tsx";
import { useSessionContext } from "./context/useSession";
import { useEntitlement } from "./hooks/useEntitlement";
import { CalendarEvents } from "./features/calendar-events";
import { PostFormPage } from "./features/instagram-posts/pages/CreatePost/index.tsx";
import { ClientView } from "./features/client-view";
import { Clients } from "./features/clients";
import { ClientForm } from "./features/clients/pages/ClientForm";
import { Config } from "./features/config";
import { LazyDashboard } from "./features/dashboard/LazyDashboard.tsx";
import { LazyHome } from "./features/home/LazyHome.tsx";
import { Order } from "./features/order";
import { OrdersList } from "./features/orders-list";
import { PoliticsPolicy } from "./features/privacy/PoliticsPolicy.tsx";
import { TermsOfUsage } from "./features/privacy/TermsOfUsage";
import { Products } from "./features/products";
import LoginScreen from "./features/session";
import { RaffleDetail } from "./features/raffle/pages/RaffleDetail";
import { RaffleForm } from "./features/raffle/pages/RaffleForm";
import { RaffleList } from "./features/raffle";
import { InstagramPosts } from "./features/instagram-posts";
import { InstagramDashboard } from "./features/instagram-dashboard";
import { InstagramComments } from "./features/instagram-comments";
import { StockMovements } from "./features/stock";
import { Comissions } from "./features/comissions";
import type { UserConfigUpdatePayload } from "./services/requests/company-configs/types.ts";
import { api } from "./services/api";
import { Connections } from "./features/connections/index.tsx";
import { EquipePage } from "./features/equipe/index.tsx";
import { AcceptInvite } from "./features/accept-invite/index.tsx";
import { ContractModal } from "./features/contract/ContractModal.tsx";
import { usePendingContract } from "./features/contract/usePendingContract.ts";
import { Register } from "./features/register/index.tsx";

export const InstagramRedirect = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const handleConnect = async () => {
    if (!code) return;

    await api.get<void>(`/api/instagram/authentications?code=${code}`);
    window.opener.postMessage(
      { type: "IG_AUTH_SUCCESS", code },
      window.location.origin,
    );

    window.close();
  };

  const { error, isLoading } = useQuery({
    queryKey: ["instagram-redirect", code],
    queryFn: handleConnect,
    enabled: !!code,
    retry: false,
  });

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Loading size={48} />
        <span>Conectando ao Instagram...</span>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <span>Erro ao conectar ao Instagram</span>
      </div>
    );

  return <div>Instagram conectado com sucesso</div>;
};

const AuthenticatedRoutes = () => {
  const hasCommissions = useEntitlement("multi_artist_commissions");
  const hasInstagramRaffles = useEntitlement("instagram_raffles");

  return (
    <Layout>
      <BillingGate>
        <Routes>
          <Route path="/agenda" element={<CalendarEvents />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/clientes/novo" element={<ClientForm />} />
          <Route path="/clientes/:id/editar" element={<ClientForm />} />
          <Route path="/clientes/:id/visualizar" element={<ClientView />} />
          <Route path="/produtos" element={<Products />} />
          <Route
            path="/politica-de-privacidade"
            element={<PoliticsPolicy />}
          />
          <Route path="/termos-de-uso" element={<TermsOfUsage />} />
          <Route path="/vendas/usuarios" element={<OrdersList />} />
          <Route path="/pedidos/:id" element={<Order />} />
          <Route path="/comissoes" element={<Comissions />} />
          <Route path="/aceitar-convite/:token" element={<AcceptInvite />} />

          <Route path="/equipe" element={<EquipePage />} />

          {hasCommissions && (
            <Route path="/estoque" element={<StockMovements />} />
          )}

          {hasInstagramRaffles && (
            <>
              <Route path="/sorteios" element={<RaffleList />} />
              <Route path="/sorteios/novo" element={<RaffleForm />} />
              <Route path="/sorteios/:id" element={<RaffleDetail />} />
              <Route
                path="/instagram/dashboard"
                element={<InstagramDashboard />}
              />
              <Route path="/instagram/posts" element={<InstagramPosts />} />
              <Route
                path="/instagram/posts/criar"
                element={<PostFormPage />}
              />
              <Route
                path="/instagram/comentarios"
                element={<InstagramComments />}
              />
            </>
          )}

          <Route
            path="/dashboard"
            element={
              <Suspense
                fallback={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100vh",
                    }}
                  >
                    <Loading
                      size={48}
                      color="var(--color-primary)"
                      outlineColor="#fff"
                    />
                  </div>
                }
              >
                <LazyHome />
              </Suspense>
            }
          />

          {hasCommissions && (
            <Route
              path="/relatorios"
              element={
                <Suspense
                  fallback={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                      }}
                    >
                      <Loading
                        size={48}
                        color="var(--color-primary)"
                        outlineColor="#fff"
                      />
                    </div>
                  }
                >
                  <LazyDashboard />
                </Suspense>
              }
            />
          )}

          <Route path="/conexoes" element={<Connections />} />
          <Route path="/configuracoes" element={<Config />} />
          <Route path="/instagram/success" element={<InstagramRedirect />} />

          {/* Legacy redirects — old paths that moved into /configuracoes or /equipe */}
          <Route
            path="/metodos-de-pagamento"
            element={<Navigate to="/configuracoes" replace />}
          />
          <Route
            path="/tags"
            element={<Navigate to="/configuracoes" replace />}
          />
          <Route
            path="/categorias"
            element={<Navigate to="/configuracoes" replace />}
          />
          <Route
            path="/indicacoes"
            element={<Navigate to="/relatorios" replace />}
          />
          <Route
            path="/usuarios"
            element={<Navigate to="/equipe" replace />}
          />
          <Route
            path="/permissoes"
            element={<Navigate to="/equipe" replace />}
          />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BillingGate>
    </Layout>
  );
};

export const RoutesProvider = () => {
  const { session, isAuthenticating, updateUserConfig } = useSessionContext();
  const queryClient = useQueryClient();
  const { contract, hasPending } = usePendingContract();
  const [progress, setProgress] = useState(0);

  useCompanySocket({
    onReceived: (data) => {
      if (data.type === "order_processed") {
        queryClient.invalidateQueries({
          queryKey: ["order", data.order.id.toString()],
          refetchType: "all",
        });

        queryClient.invalidateQueries({
          refetchType: "all",
          predicate: (query) =>
            typeof query.queryKey?.[0] === "string" &&
            query.queryKey[0].toLowerCase().includes("orders"),
        });

        toast.success(`Pedido ${data.order.id} pago com sucesso`);
      } else if (data.type === "products_price_applied") {
        if (data.data.status === "success") {
          toast.success(data.data.message);
          updateUserConfig(
            {
              product_percentage_variation: 0,
            } as UserConfigUpdatePayload,
            false,
          );
        } else {
          toast.error(data.data.message);
        }
      }
    },
  });

  const handleChangeProgress = () => {
    switch (progress) {
      case 0:
        setProgress(20);
        break;
      case 20:
        setProgress(35);
        break;
      case 35:
        setProgress(50);
        break;
      case 50:
        setProgress(83);
        break;
      case 83:
        setProgress(100);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (progress === 100 || session.isAuthenticated) return;

    const interval = setTimeout(() => {
      handleChangeProgress();
    }, 130);

    return () => clearTimeout(interval);
  }, [progress, session.isAuthenticated]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data.type === "IG_AUTH_SUCCESS" &&
        event.data.code &&
        event.origin === window.location.origin
      ) {
        toast.success("Instagram conectado com sucesso");
        queryClient.invalidateQueries({
          predicate: (query) =>
            typeof query.queryKey?.[0] === "string" &&
            query.queryKey[0].toLowerCase().includes("instagram-accounts"),
          refetchType: "all",
        });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (isAuthenticating) {
    return <LoadingScreen variant="rainbow" showProgress progress={progress} />;
  }

  return (
    <BrowserRouter>
      {session.isAuthenticated ? (
        <AuthenticatedRoutes />
      ) : (
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/politica-de-privacidade" element={<PoliticsPolicy />} />
          <Route path="/termos-de-uso" element={<TermsOfUsage />} />
          <Route path="/aceitar-convite/:token" element={<AcceptInvite />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
      {hasPending && contract && (
        <ContractModal
          contract={contract}
          onSigned={() =>
            queryClient.invalidateQueries({ queryKey: ["session"] })
          }
        />
      )}
    </BrowserRouter>
  );
};
