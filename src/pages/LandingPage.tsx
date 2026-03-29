import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { G, injectStyles, btn } from "@/lib/nexgo-theme";
import NEXGO_LOGO from "@/assets/nexgo-logo.png";

const FEATURES = [
  {
    icon: "🍔",
    title: "NexChow",
    desc: "Order meals from campus restaurants and vendors. Browse menus, customize orders, and pay seamlessly from your wallet.",
  },
  {
    icon: "📦",
    title: "NexDispatch",
    desc: "Send or receive packages across campus with reliable peer-to-peer dispatch. Track your package in real time.",
  },
  {
    icon: "🚐",
    title: "NexTrip",
    desc: "Book affordable campus shuttle rides. See routes, departure times, and available seats at a glance.",
  },
  {
    icon: "💳",
    title: "NexWallet",
    desc: "One wallet for everything. Top up, pay for orders, trips, and dispatches — all from a single balance.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create Your Account", desc: "Sign up with your email and pick your role — student, vendor, or rider." },
  { step: "02", title: "Fund Your Wallet", desc: "Top up your NexWallet securely via Paystack. Your balance powers all transactions." },
  { step: "03", title: "Start Using Services", desc: "Order food, send packages, or book rides — everything you need, in one place." },
  { step: "04", title: "Track & Enjoy", desc: "Get real-time updates on your orders, dispatches, and trips. Rate and review when done." },
];

const STATS = [
  { value: "24/7", label: "Support" },
];


const FAQ = [
  { q: "Is NexGo free to use?", a: "Yes! Creating an account is completely free. You only pay for the services you use — food orders, dispatches, and trips." },
  { q: "How do I fund my wallet?", a: "You can top up your NexWallet instantly using Paystack. We support bank transfers, cards, and USSD." },
  { q: "Can I become a vendor or rider?", a: "Absolutely. Sign up and select your role. Vendors can list their restaurant and menu, while riders can start accepting dispatch and delivery requests." },
  { q: "What campuses is NexGo available on?", a: "We're currently launching on select Nigerian university campuses and expanding rapidly. Stay tuned!" },
];

export default function LandingPage() {
  useEffect(() => { injectStyles(); }, []);
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const sectionStyle: React.CSSProperties = { padding: "80px 20px", maxWidth: 1100, margin: "0 auto" };
  const headingStyle: React.CSSProperties = { fontFamily: "'Cormorant Garamond'", fontSize: 32, fontWeight: 700, color: G.white, textAlign: "center", marginBottom: 12 };
  const subStyle: React.CSSProperties = { color: G.whiteDim, fontSize: 15, textAlign: "center", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 };

  return (
    <div style={{ minHeight: "100vh", background: G.black, overflow: "hidden" }}>

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", maxWidth: 1100, margin: "0 auto",
        backdropFilter: "blur(12px)", background: "rgba(10,10,10,0.8)",
      }}>
        <img src={NEXGO_LOGO} alt="NexGo" style={{ height: 36, objectFit: "contain" }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ ...btn("outline"), padding: "10px 22px", fontSize: 13, borderRadius: 10 }} onClick={() => navigate("/signin")}>Sign In</button>
          <button style={{ ...btn("gold"), padding: "10px 22px", fontSize: 13, borderRadius: 10 }} onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ position: "relative", padding: "100px 20px 80px", textAlign: "center" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle,${G.goldGlow} 0%,transparent 70%)`, top: -250, right: -200, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%)`, bottom: -100, left: -150, pointerEvents: "none" }} />

        <div style={{ animation: "fadeUp .6s ease", maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: G.goldGlow, border: `1px solid ${G.goldBorder}`, color: G.gold, fontSize: 12, fontWeight: 600, letterSpacing: ".06em", marginBottom: 24, textTransform: "uppercase" }}>
            🚀 Built for Campus Life
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 48, fontWeight: 700, color: G.white, lineHeight: 1.1, marginBottom: 16 }}>
            Your Campus,{" "}
            <span style={{ color: G.gold, animation: "glow 3s infinite" }}>Supercharged</span>
          </h1>

          <p style={{ color: G.whiteDim, fontSize: 17, lineHeight: 1.7, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
            Order food, send packages, book rides — all in one app built for Nigerian university students, vendors, and riders.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ ...btn("gold"), padding: "16px 44px", fontSize: 15, borderRadius: 12 }} onClick={() => navigate("/signup")}>
              Get Started Free →
            </button>
            <button style={{ ...btn("outline"), padding: "16px 44px", fontSize: 15, borderRadius: 12 }} onClick={() => {
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}>
              Learn More ↓
            </button>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={{ borderTop: `1px solid ${G.b4}`, borderBottom: `1px solid ${G.b4}`, background: G.b2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", maxWidth: 900, margin: "0 auto", padding: "32px 20px", gap: 20, textAlign: "center" }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 36, fontWeight: 700, color: G.gold }}>{s.value}</div>
              <div style={{ fontSize: 13, color: G.whiteDim, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={sectionStyle}>
        <h2 style={headingStyle}>Everything You Need, <span style={{ color: G.gold }}>One App</span></h2>
        <p style={subStyle}>NexGo brings together food ordering, package delivery, and campus transportation into a single, elegant platform.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="hover-gold hover-lift" style={{
              background: G.b3, border: `1px solid ${G.b5}`, borderRadius: 16, padding: 28,
              transition: "all .25s ease", cursor: "default",
            }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 600, color: G.white, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: G.whiteDim, fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ ...sectionStyle, background: G.b2, borderRadius: 24, border: `1px solid ${G.b4}`, marginTop: 0, marginBottom: 0, maxWidth: "100%", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={headingStyle}>How It <span style={{ color: G.gold }}>Works</span></h2>
          <p style={subStyle}>Getting started takes less than 2 minutes. Here's how.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {HOW_IT_WORKS.map((h) => (
              <div key={h.step} style={{ textAlign: "center", padding: 20 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", margin: "0 auto 16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `linear-gradient(135deg,${G.gold},${G.goldDark})`,
                  color: G.black, fontFamily: "'DM Mono'", fontWeight: 700, fontSize: 18,
                }}>
                  {h.step}
                </div>
                <h4 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, fontWeight: 600, color: G.white, marginBottom: 8 }}>{h.title}</h4>
                <p style={{ color: G.whiteDim, fontSize: 13, lineHeight: 1.6 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOR EVERYONE ─── */}
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Built for <span style={{ color: G.gold }}>Everyone</span></h2>
        <p style={subStyle}>Whether you're hungry, shipping something, or need a ride — NexGo has you covered.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            { icon: "🎓", title: "Students", points: ["Order food from campus vendors", "Send & receive packages", "Book shuttle rides", "Pay with NexWallet"] },
            { icon: "🏪", title: "Vendors", points: ["List your restaurant & menu", "Receive and manage orders", "Track revenue on dashboard", "Grow your campus customer base"] },
            { icon: "🏍️", title: "Riders", points: ["Accept delivery requests", "Earn on your own schedule", "Navigate with ease", "Get paid directly to wallet"] },
          ].map((r) => (
            <div key={r.title} style={{ background: G.b3, border: `1px solid ${G.b5}`, borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{r.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 600, color: G.white, marginBottom: 16 }}>{r.title}</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {r.points.map((p) => (
                  <li key={p} style={{ color: G.whiteDim, fontSize: 14, lineHeight: 1.5, padding: "6px 0", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: G.gold, fontSize: 14 }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ ...sectionStyle, paddingTop: 40 }}>
        <h2 style={headingStyle}>What Users <span style={{ color: G.gold }}>Say</span></h2>
        <p style={subStyle}>Real feedback from real campus users.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={{ background: G.b3, border: `1px solid ${G.b5}`, borderRadius: 16, padding: 28 }}>
              <p style={{ color: G.whiteDim, fontSize: 14, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg,${G.gold},${G.goldDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: G.black, fontWeight: 700, fontSize: 16,
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: G.white }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: G.whiteDim }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ ...sectionStyle, paddingTop: 40 }}>
        <h2 style={headingStyle}>Frequently Asked <span style={{ color: G.gold }}>Questions</span></h2>
        <p style={subStyle}>Got questions? We've got answers.</p>

        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQ.map((f, i) => (
            <div key={i} style={{ background: G.b3, border: `1px solid ${G.b5}`, borderRadius: 12, overflow: "hidden" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", padding: "18px 20px", background: "transparent", border: "none",
                  color: G.white, fontSize: 15, fontWeight: 500, textAlign: "left", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                {f.q}
                <span style={{ color: G.gold, fontSize: 20, transition: "transform .2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 18px", color: G.whiteDim, fontSize: 14, lineHeight: 1.7, animation: "slideIn .2s ease" }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ padding: "80px 20px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${G.goldGlow} 0%,transparent 70%)`, bottom: -200, left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 36, fontWeight: 700, color: G.white, marginBottom: 16 }}>
            Ready to <span style={{ color: G.gold }}>NexGo</span>?
          </h2>
          <p style={{ color: G.whiteDim, fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Join thousands of students, vendors, and riders already using NexGo to make campus life easier.
          </p>
          <button style={{ ...btn("gold"), padding: "18px 52px", fontSize: 16, borderRadius: 14 }} onClick={() => navigate("/signup")}>
            Create Free Account →
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: `1px solid ${G.b4}`, padding: "40px 20px", textAlign: "center" }}>
        <img src={NEXGO_LOGO} alt="NexGo" style={{ height: 28, objectFit: "contain", marginBottom: 16, opacity: 0.7 }} />
        <p style={{ color: G.whiteDim, fontSize: 13 }}>© {new Date().getFullYear()} NexGo. All rights reserved.</p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12 }}>
          {["Privacy Policy", "Terms of Service", "Contact Us"].map((link) => (
            <span key={link} style={{ color: G.whiteDim, fontSize: 12, cursor: "pointer", transition: "color .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = G.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = G.whiteDim)}
            >{link}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
