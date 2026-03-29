import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { G, injectStyles, btn } from "@/lib/nexgo-theme";
import NEXGO_LOGO from "@/assets/nexgo-logo.png";

export default function LandingPage() {
  useEffect(() => { injectStyles(); }, []);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, background: G.black, position: "relative", overflow: "hidden" }}>
      {/* Decorative glows */}
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${G.goldGlow} 0%,transparent 70%)`, top: -200, right: -200, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%)`, bottom: -150, left: -150, pointerEvents: "none" }} />

      <div style={{ textAlign: "center", animation: "fadeUp .6s ease", maxWidth: 520, zIndex: 1 }}>
        <img src={NEXGO_LOGO} alt="NexGo" style={{ width: 220, objectFit: "contain", filter: "drop-shadow(0 0 24px rgba(201,168,76,0.4))", marginBottom: 24 }} />

        <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 38, fontWeight: 700, color: G.white, lineHeight: 1.15, marginBottom: 12 }}>
          Your Campus,{" "}
          <span style={{ color: G.gold }}>Supercharged</span>
        </h1>

        <p style={{ color: G.whiteDim, fontSize: 15, lineHeight: 1.6, marginBottom: 40, maxWidth: 400, margin: "0 auto 40px" }}>
          Order food, send packages, book rides — all in one app built for campus life.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            style={{ ...btn("gold"), padding: "16px 40px", fontSize: 15, borderRadius: 12 }}
            onClick={() => navigate("/signup")}
          >
            Sign Up →
          </button>
          <button
            style={{ ...btn("outline"), padding: "16px 40px", fontSize: 15, borderRadius: 12 }}
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
