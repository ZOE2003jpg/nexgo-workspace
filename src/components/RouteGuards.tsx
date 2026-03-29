import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { G } from "@/lib/nexgo-theme";
import { Spinner } from "@/components/nexgo/SharedUI";

/** Redirects authenticated users away (e.g. from / to /app) */
export function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: G.black }}>
      <Spinner size={28} color={G.gold} />
    </div>
  );
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

/** Redirects unauthenticated users to /signin */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: G.black }}>
      <Spinner size={28} color={G.gold} />
    </div>
  );
  if (!user) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}
