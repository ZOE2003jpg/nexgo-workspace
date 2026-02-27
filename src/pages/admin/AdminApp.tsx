import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { G, btn, card, inp } from "@/lib/nexgo-theme";
import { STitle, PHeader, Badge, Lbl, Spinner } from "@/components/nexgo/SharedUI";
import { ProfileScreen } from "@/pages/shared/ProfileScreen";
import { toast } from "@/components/nexgo/ToastContainer";

export function AdminApp({ tab, onLogout }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRest, setSelectedRest] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("id, full_name, created_at, avatar_url").order("created_at", { ascending: false })
      .then(async ({ data: profiles }) => {
        if (!profiles) return;
        const enriched = await Promise.all(profiles.map(async (p: any) => {
          const { data: roleData } = await supabase.rpc("get_user_role", { _user_id: p.id });
          return { ...p, role: roleData || "student" };
        }));
        setUsers(enriched);
      });
    supabase.from("orders").select("id, order_number, total_amount, status, created_at, restaurants(name)").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => { if (data) setOrders(data); });
    supabase.from("restaurants").select("*").then(({ data }) => { if (data) setRestaurants(data); });
  }, []);

  useEffect(() => {
    if (!selectedRest) { setMenuItems([]); return; }
    supabase.from("menu_items").select("*").eq("restaurant_id", selectedRest.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setMenuItems(data); });
  }, [selectedRest]);

  if (tab === "users") return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp .4s ease", maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <PHeader title="Users" sub="Manage all users" icon="👥" />
      <input style={inp()} placeholder="🔍  Search users…" value={search} onChange={e => setSearch(e.target.value)} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {users.filter((u: any) => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.role?.toLowerCase().includes(search.toLowerCase())).map((u: any) => (
          <div key={u.id} style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${G.goldDark},${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: G.black }}>{u.full_name?.[0] || "?"}</div>
                <div>
                  <div style={{ fontWeight: 600, color: G.white, fontSize: 14 }}>{u.full_name}</div>
                  <div style={{ fontSize: 11, color: G.whiteDim, textTransform: "capitalize" }}>{u.role} · Joined {new Date(u.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (tab === "restaurants") return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp .4s ease", maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <PHeader title="Restaurants" sub="All vendors" icon="🍽️" />
      {selectedRest ? (
        <>
          <button onClick={() => setSelectedRest(null)} style={{ ...btn("ghost", { width: "fit-content", padding: "8px 16px", fontSize: 13 }) }}>← Back to list</button>
          <div style={card({ display: "flex", gap: 14, alignItems: "center" })}>
            <span style={{ fontSize: 40 }}>{selectedRest.image}</span>
            <div>
              <div style={{ fontWeight: 700, color: G.white, fontSize: 18 }}>{selectedRest.name}</div>
              <div style={{ fontSize: 12, color: G.whiteDim }}>{selectedRest.cuisine} · {selectedRest.is_open ? "🟢 Open" : "⚫ Closed"}</div>
            </div>
          </div>
          <STitle>Menu Items ({menuItems.length})</STitle>
          {menuItems.map((item: any) => (
            <div key={item.id} style={card({ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: item.available ? 1 : 0.5 })}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>{item.image}</span>
                <div>
                  <div style={{ fontWeight: 600, color: G.white, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: G.whiteDim }}>{item.description}</div>
                  <div style={{ color: G.gold, fontFamily: "'DM Mono'", fontSize: 13, marginTop: 3 }}>₦{item.price.toLocaleString()}</div>
                </div>
              </div>
              <Badge status={item.available ? "Available" : "Unavailable"} />
            </div>
          ))}
          {menuItems.length === 0 && <div style={{ ...card(), textAlign: "center", color: G.whiteDim }}>No menu items</div>}
        </>
      ) : (
        <>
          {restaurants.map((r: any) => (
            <div key={r.id} onClick={() => setSelectedRest(r)} className="hover-gold" style={{ ...card({ cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }) }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: G.b4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{r.image}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: G.white, fontSize: 15 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: G.whiteDim }}>{r.cuisine} · ⭐ {r.rating}</div>
              </div>
              <Badge status={r.is_open ? "Open" : "Closed"} />
            </div>
          ))}
          {restaurants.length === 0 && <div style={{ ...card(), textAlign: "center", color: G.whiteDim }}>No restaurants yet</div>}
        </>
      )}
    </div>
  );

  if (tab === "orders") return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp .4s ease", maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <PHeader title="All Orders" sub="Platform-wide orders" icon="📦" />
      {orders.map((o: any) => (
        <div key={o.id} style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, color: G.white, fontSize: 14 }}>{o.order_number}</div>
              <div style={{ fontSize: 12, color: G.whiteDim }}>{(o.restaurants as any)?.name} · {new Date(o.created_at).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: G.gold, fontFamily: "'DM Mono'", fontSize: 13 }}>₦{o.total_amount?.toLocaleString()}</div>
              <Badge status={o.status} />
            </div>
          </div>
        </div>
      ))}
      {orders.length === 0 && <div style={{ ...card(), textAlign: "center", color: G.whiteDim }}>No orders yet</div>}
    </div>
  );

  if (tab === "analytics") return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20, animation: "fadeUp .4s ease", maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <PHeader title="Analytics" sub="Platform insights" icon="📈" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[{ l: "Total Users", v: String(users.length), ic: "👥" }, { l: "Total Orders", v: String(orders.length), ic: "📦" }, { l: "Restaurants", v: String(restaurants.length), ic: "🍽️" }, { l: "Revenue", v: `₦${orders.reduce((a: number, o: any) => a + (o.total_amount || 0), 0).toLocaleString()}`, ic: "💰" }].map((s: any) => (
          <div key={s.l} style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, color: G.whiteDim, marginBottom: 6 }}>{s.l}</div>
                <div style={{ fontFamily: "'DM Mono'", fontSize: 22, fontWeight: 700, color: G.gold }}>{s.v}</div>
              </div>
              <span style={{ fontSize: 24 }}>{s.ic}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (tab === "profile") return <ProfileScreen onLogout={onLogout} />;

  // Admin Dashboard
  return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20, animation: "fadeUp .4s ease", maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <PHeader title="Admin Panel" sub="NexGo operations overview" icon="⚙️" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[{ label: "Total Users", value: String(users.length), icon: "👥" }, { label: "Orders", value: String(orders.length), icon: "📦" }, { label: "Restaurants", value: String(restaurants.length), icon: "🍽️" }, { label: "Revenue", value: `₦${orders.reduce((a: number, o: any) => a + (o.total_amount || 0), 0).toLocaleString()}`, icon: "💰" }].map((s: any) => (
          <div key={s.label} style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, color: G.whiteDim, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontFamily: "'DM Mono'", fontSize: 22, fontWeight: 700, color: G.gold }}>{s.value}</div>
              </div>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={card()}>
        <STitle>Recent Users</STitle>
        {users.slice(0, 5).map((u: any, i: number, arr: any[]) => (
          <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? `1px solid ${G.b5}` : "none" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${G.goldDark},${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: G.black }}>{u.full_name?.[0] || "?"}</div>
              <div>
                <div style={{ fontWeight: 600, color: G.white, fontSize: 14 }}>{u.full_name}</div>
                <div style={{ fontSize: 11, color: G.whiteDim, textTransform: "capitalize" }}>{u.role} · {new Date(u.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
