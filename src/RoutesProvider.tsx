import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { LoadingScreen } from "./components/LoadingScreen";
import { Loading } from "./components/ui/Loading/index.tsx";
import { useCompanySocket } from "./context/useCompanySocket.tsx";
import { useSessionContext } from "./context/useSession";
import { CalendarEvents } from "./features/calendar-events";
import { Indications } from "./features/indications/index.tsx";
import { PostFormPage } from "./features/instagram-posts/pages/CreatePost/index.tsx";
import { Tags } from "./features/tags/index.tsx";
import { ClientView } from "./features/client-view";
import { Clients } from "./features/clients";
import { ClientForm } from "./features/clients/pages/ClientForm";
import { Config } from "./features/config";
import { LazyDashboard } from "./features/dashboard/LazyDashboard.tsx";
import { Categories } from "./features/categories";
import { Order } from "./features/order";
import { OrdersList } from "./features/orders-list";
import { PaymentMethods } from "./features/payment-methods";
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
import { UsersPage } from "./features/users/index.tsx";
import { AcceptInvite } from "./features/accept-invite/index.tsx";
import { RolesPage } from "./features/roles/index.tsx";
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

  const routes = useMemo(() => {
    if (session.isAuthenticated) {
      return (
        <Layout>
          <Routes>
            <Route path="/agenda" element={<CalendarEvents />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/clientes/novo" element={<ClientForm />} />
            <Route path="/clientes/:id/editar" element={<ClientForm />} />
            <Route path="/clientes/:id/visualizar" element={<ClientView />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/indicacoes" element={<Indications />} />
            <Route
              path="/politica-de-privacidade"
              element={<PoliticsPolicy />}
            />
            <Route path="/termos-de-uso" element={<TermsOfUsage />} />
            <Route path="/metodos-de-pagamento" element={<PaymentMethods />} />
            <Route
              path="/vendas/usuarios"
              element={<OrdersList createdBy="user" />}
            />
            <Route path="/pedidos/:id" element={<Order />} />
            <Route path="/estoque" element={<StockMovements />} />
            <Route path="/comissoes" element={<Comissions />} />
            <Route path="/aceitar-convite/:token" element={<AcceptInvite />} />

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
                  <LazyDashboard />
                </Suspense>
              }
            />
            <Route path="/sorteios" element={<RaffleList />} />
            <Route path="/sorteios/novo" element={<RaffleForm />} />
            <Route path="/sorteios/:id" element={<RaffleDetail />} />
            <Route
              path="/instagram/dashboard"
              element={<InstagramDashboard />}
            />
            <Route path="/instagram/posts" element={<InstagramPosts />} />
            <Route path="/instagram/posts/criar" element={<PostFormPage />} />
            <Route
              path="/instagram/comentarios"
              element={<InstagramComments />}
            />
            <Route path="/conexoes" element={<Connections />} />
            <Route path="/usuarios" element={<UsersPage />} />
            <Route path="/permissoes" element={<RolesPage />} />
            <Route path="/configuracoes" element={<Config />} />
            <Route path="/instagram/success" element={<InstagramRedirect />} />
            <Route path="*" element={<Navigate to="/agenda" />} />
          </Routes>
        </Layout>
      );
    }

    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/politica-de-privacidade" element={<PoliticsPolicy />} />
        <Route path="/termos-de-uso" element={<TermsOfUsage />} />
        <Route path="/aceitar-convite/:token" element={<AcceptInvite />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }, [session.isAuthenticated]);

  if (isAuthenticating) {
    return <LoadingScreen variant="rainbow" showProgress progress={progress} />;
  }

  return (
    <BrowserRouter>
      {routes}
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
