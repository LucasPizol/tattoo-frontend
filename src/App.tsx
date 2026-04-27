import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { MdCheckCircle, MdError } from "react-icons/md";
import { SessionProvider } from "./context/useSession";
import { ThemeProvider } from "./context/ThemeContext";
import "./globals.css";
import { RoutesProvider } from "./RoutesProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <SessionProvider>
        <RoutesProvider />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              padding: "8px 18px",
              borderRadius: "24px",
              borderWidth: "1px",
              borderStyle: "solid",
              background: "var(--parchment-raised)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            },
            success: {
              icon: <MdCheckCircle size={20} />,
              style: {
                background: "var(--color-success-bg)",
                borderColor: "var(--color-success-border)",
                color: "var(--color-success-border)",
              },
            },
            error: {
              style: {
                background: "var(--color-error-bg)",
                borderColor: "var(--color-error-border)",
                color: "var(--color-error-border)",
              },
              icon: <MdError size={20} />,
            },
          }}
        />
      </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
