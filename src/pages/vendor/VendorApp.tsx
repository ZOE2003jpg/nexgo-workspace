import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { G, btn, card, inp } from "@/lib/nexgo-theme";
import { STitle, PHeader, Badge, Spinner, Lbl } from "@/components/nexgo/SharedUI";
import { toast } from "@/components/nexgo/ToastContainer";
import { ProfileScreen } from "@/pages/shared/ProfileScreen";

function CreateRestaurant({ userId, onCreated }: { userId: string; onCreated: (r: any) => void }) {
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("Nigerian");
  const [deliveryTime, setDeliveryTime] = useState("20-30 min");
  const [priceRange, setPriceRange] = useState("₦500–₦3,000");
  const [image, setImage] = useState("🍲");
  const [saving, setSaving] = useState(false);

  const create = async () => {
    if (!name.trim()) { toast("Enter restaurant name", "error"); return; }
    setSaving(true);
    const { data, error } = await supabase.from("restaurants").insert({
      name: name.trim(), cuisine, delivery_time: deliveryTime, price_range: priceRange,
      image, owner_id: userId, is_open: true,
    }).select().single();
    setSaving(false);
    if (error) { toast("Failed: " + error.message, "error"); return; }
    toast("Restaurant created! 🎉", "success");
    onCreated(data);
  };

  return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .4s ease", maxWidth: 600, margin: "0 auto", width: "100%" }}>
      <PHeader title="Create Restaurant" sub="Set up your food business" icon="🏪" />
      <div style={card({ display: "flex", flexDirection: "column", gap: 14 })}>
        <Lbl>Restaurant Name</Lbl>
        <input style={inp()} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mama's Kitchen" />
        <Lbl>Cuisine</Lbl>
        <input style={inp()} value={cuisine} onChange={e => setCuisine(e.target.value)} placeholder="e.g. Nigerian" />
        <Lbl>Delivery Time</Lbl>
        <input style={inp()} value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} placeholder="e.g. 20-30 min" />
        <Lbl>Price Range</Lbl>
        <input style={inp()} value={priceRange} onChange={e => setPriceRange(e.target.value)} placeholder="e.g. ₦500–₦3,000" />
        <Lbl>Emoji Icon</Lbl>
        <input style={inp()} value={image} onChange={e => setImage(e.target.value)} placeholder="e.g. 🍲" maxLength={4} />
        <button onClick={create} disabled={saving} style={{ ...btn("gold", { width: "100%", padding: "14px", marginTop: 8 }) }}>
          {saving ? <Spinner /> : "Create Restaurant →"}
        </button>
      </div>
    </div>
  );
}

function EditRestaurant({ restaurant, onSaved }: { restaurant: any; onSaved: (r: any) => void }) {
  const [name, setName] = useState(restaurant.name);
  const [cuisine, setCuisine] = useState(restaurant.cuisine);
  const [deliveryTime, setDeliveryTime] = useState(restaurant.delivery_time);
  const [priceRange, setPriceRange] = useState(restaurant.price_range || "");
  const [image, setImage] = useState(restaurant.image);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) { toast("Name required", "error"); return; }
    setSaving(true);
    const { data, error } = await supabase.from("restaurants").update({
      name: name.trim(), cuisine, delivery_time: deliveryTime, price_range: priceRange, image,
    }).eq("id", restaurant.id).select().single();
    setSaving(false);
    if (error) { toast("Failed: " + error.message, "error"); return; }
    toast("Restaurant updated!", "success");
    onSaved(data);
  };

  return (
    <div style={card({ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 })}>
      <STitle>Edit Restaurant</STitle>
      <Lbl>Name</Lbl>
      <input style={inp()} value={name} onChange={e => setName(e.target.value)} />
      <Lbl>Cuisine</Lbl>
      <input style={inp()} value={cuisine} onChange={e => setCuisine(e.target.value)} />
      <Lbl>Delivery Time</Lbl>
      <input style={inp()} value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} />
      <Lbl>Price Range</Lbl>
      <input style={inp()} value={priceRange} onChange={e => setPriceRange(e.target.value)} />
      <Lbl>Emoji Icon</Lbl>
      <input style={inp()} value={image} onChange={e => setImage(e.target.value)} maxLength={4} />
      <button onClick={save} disabled={saving} style={{ ...btn("gold", { width: "100%", padding: "13px" }) }}>
        {saving ? <Spinner /> : "Save Changes"}
      </button>
    </div>
  );
}

function MenuItemForm({ restaurantId, item, onSaved, onCancel }: { restaurantId: string; item?: any; onSaved: () => void; onCancel: () => void }) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [image, setImage] = useState(item?.image || "🍚");
  const [available, setAvailable] = useState(item?.available ?? true);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) { toast("Name required", "error"); return; }
    const p = parseInt(price);
    if (isNaN(p) || p <= 0) { toast("Enter a valid price", "error"); return; }
    setSaving(true);
    if (item) {
      const { error } = await supabase.from("menu_items").update({ name: name.trim(), description, price: p, image, available }).eq("id", item.id);
      if (error) { toast("Failed: " + error.message, "error"); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("menu_items").insert({ name: name.trim(), description, price: p, image, available, restaurant_id: restaurantId });
      if (error) { toast("Failed: " + error.message, "error"); setSaving(false); return; }
    }
    setSaving(false);
    toast(item ? "Item updated!" : "Item added!", "success");
    onSaved();
  };

  return (
    <div style={card({ display: "flex", flexDirection: "column", gap: 12, border: `1.5px solid ${G.gold}` })}>
      <STitle>{item ? "Edit Item" : "Add Item"}</STitle>
      <Lbl>Name</Lbl>
      <input style={inp()} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jollof Rice" />
      <Lbl>Description</Lbl>
      <input style={inp()} value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" />
      <Lbl>Price (₦)</Lbl>
      <input style={inp()} type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 1500" />
      <Lbl>Emoji Icon</Lbl>
      <input style={inp()} value={image} onChange={e => setImage(e.target.value)} maxLength={4} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div onClick={() => setAvailable(!available)} style={{ width: 44, height: 24, borderRadius: 12, background: available ? G.success : G.b5, cursor: "pointer", position: "relative", transition: "all .2s" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: G.white, position: "absolute", top: 2, left: available ? 22 : 2, transition: "all .2s" }} />
        </div>
        <span style={{ fontSize: 13, color: available ? G.success : G.whiteDim }}>{available ? "Available" : "Unavailable"}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={save} disabled={saving} style={{ ...btn("gold", { flex: 1, padding: "12px" }) }}>
          {saving ? <Spinner /> : item ? "Update" : "Add Item"}
        </button>
        <button onClick={onCancel} style={{ ...btn("ghost", { padding: "12px 16px" }) }}>Cancel</button>
      </div>
    </div>
  );
}

export function VendorApp({ tab, onLogout }: any) {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [loadingRest, setLoadingRest] = useState(true);
  const [editingRest, setEditingRest] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoadingRest(true);
    supabase.from("restaurants").select("*").eq("owner_id", user.id).limit(1).maybeSingle()
      .then(({ data }) => { if (data) { setRestaurant(data); setIsOpen(data.is_open); } setLoadingRest(false); });
  }, [user]);

  const fetchMenu = useCallback(() => {
    if (!restaurant) return;
    supabase.from("menu_items").select("*").eq("restaurant_id", restaurant.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setMenuItems(data); });
  }, [restaurant]);

  const fetchOrders = useCallback(() => {
    if (!restaurant) return;
    supabase.from("orders").select("*, order_items(*)").eq("restaurant_id", restaurant.id).order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => { if (data) setOrders(data); });
  }, [restaurant]);

  useEffect(() => {
    if (!restaurant) return;
    fetchOrders();
    fetchMenu();
  }, [restaurant, fetchOrders, fetchMenu]);

  useEffect(() => {
    if (!restaurant) return;
    const channel = supabase.channel('vendor-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurant.id}` }, () => { fetchOrders(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [restaurant, fetchOrders]);

  const toggleOpen = async () => {
    if (!restaurant) return;
    const newState = !isOpen;
    await supabase.from("restaurants").update({ is_open: newState }).eq("id", restaurant.id);
    setIsOpen(newState);
  };

  const toggleItemAvailability = async (item: any) => {
    setTogglingId(item.id);
    const newAvail = !item.available;
    await supabase.from("menu_items").update({ available: newAvail }).eq("id", item.id);
    setMenuItems(p => p.map(m => m.id === item.id ? { ...m, available: newAvail } : m));
    toast(`${item.name} ${newAvail ? "available" : "unavailable"}`, "success");
    setTogglingId(null);
  };

  const deleteItem = async (id: string) => {
    await supabase.from("menu_items").delete().eq("id", id);
    setMenuItems(p => p.filter(m => m.id !== id));
    toast("Item deleted", "success");
  };

  const nextStatus = async (id: string, current: string) => {
    if (!user) return;
    setUpdatingId(id);
    const statusMap: any = { "Pending": "accepted", "accepted": "preparing", "preparing": "ready" };
    const next = statusMap[current];
    if (!next) { toast("No valid next status", "error"); setUpdatingId(null); return; }
    const { data: validation } = await supabase.rpc("validate_order_transition", { _order_id: id, _new_status: next, _user_id: user.id });
    const v = validation as any;
    if (!v?.valid) { toast(v?.message || "Invalid transition", "error"); setUpdatingId(null); return; }
    await supabase.from("orders").update({ status: next }).eq("id", id);
    setOrders(p => p.map(o => o.id === id ? { ...o, status: next } : o));
    toast(`Order → ${next}`, "success");
    setUpdatingId(null);
  };

  const cancelOrder = async (id: string) => {
    if (!user) return;
    setUpdatingId(id);
    const { data: validation } = await supabase.rpc("validate_order_transition", { _order_id: id, _new_status: "cancelled", _user_id: user.id });
    const v = validation as any;
    if (!v?.valid) { toast(v?.message || "Cannot cancel", "error"); setUpdatingId(null); return; }
    await supabase.from("orders").update({ status: "cancelled", cancelled_by: user.id, cancellation_reason: "Cancelled by vendor" }).eq("id", id);
    setOrders(p => p.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
    toast("Order cancelled", "success");
    setUpdatingId(null);
  };

  if (loadingRest) return <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner size={32} color={G.gold} /></div>;

  if (!restaurant) return <CreateRestaurant userId={user!.id} onCreated={(r) => { setRestaurant(r); setIsOpen(r.is_open); }} />;

  const restName = restaurant?.name || profile?.full_name || "Vendor";
  const statusLabel: any = { "Pending": "Accept", "accepted": "Start Prep", "preparing": "Mark Ready" };

  if (tab === "orders") return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp .4s ease", maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <PHeader title="Orders" sub="Manage incoming orders" icon="📦" />
      {orders.length === 0 && <div style={{ ...card(), textAlign: "center", color: G.whiteDim }}>No orders yet</div>}
      {orders.map((o: any) => (
        <div key={o.id} style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, color: G.white }}>{o.order_number}</span><Badge status={o.status} />
          </div>
          <div style={{ fontSize: 13, color: G.whiteDim, marginBottom: 3 }}>{o.order_items?.map((i: any) => `${i.name} x${i.quantity}`).join(", ")}</div>
          <div style={{ fontSize: 13, color: G.whiteDim, marginBottom: 12 }}>{new Date(o.created_at).toLocaleString()}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: G.gold, fontFamily: "'DM Mono'", fontWeight: 700 }}>₦{o.total_amount?.toLocaleString()}</span>
            <div style={{ display: "flex", gap: 8 }}>
              {statusLabel[o.status] && (
                <button onClick={() => nextStatus(o.id, o.status)} disabled={updatingId === o.id} style={{ ...btn("gold", { padding: "8px 16px", fontSize: 12, opacity: updatingId === o.id ? .5 : 1 }) }}>
                  {updatingId === o.id ? <Spinner size={12} /> : statusLabel[o.status]}
                </button>
              )}
              {["Pending", "accepted", "preparing"].includes(o.status) && (
                <button onClick={() => cancelOrder(o.id)} disabled={updatingId === o.id} style={{ ...btn("ghost", { padding: "8px 12px", fontSize: 12, color: G.danger, border: `1px solid ${G.danger}40` }) }}>✕</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (tab === "menu") return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp .4s ease", maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <PHeader title="Menu" sub="Manage your items" icon="🍽️" />
        {!showAddItem && !editingItem && (
          <button onClick={() => setShowAddItem(true)} style={{ ...btn("gold", { padding: "8px 16px", fontSize: 12 }) }}>+ Add Item</button>
        )}
      </div>
      {showAddItem && <MenuItemForm restaurantId={restaurant.id} onSaved={() => { setShowAddItem(false); fetchMenu(); }} onCancel={() => setShowAddItem(false)} />}
      {editingItem && <MenuItemForm restaurantId={restaurant.id} item={editingItem} onSaved={() => { setEditingItem(null); fetchMenu(); }} onCancel={() => setEditingItem(null)} />}
      {menuItems.length === 0 && !showAddItem && <div style={{ ...card(), textAlign: "center", color: G.whiteDim }}>No menu items yet. Add your first item!</div>}
      {menuItems.map((item: any) => (
        <div key={item.id} style={card({ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: item.available ? 1 : 0.5 })}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
            <span style={{ fontSize: 28 }}>{item.image}</span>
            <div>
              <div style={{ fontWeight: 600, color: G.white, fontSize: 14 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: G.whiteDim }}>{item.description}</div>
              <div style={{ color: G.gold, fontFamily: "'DM Mono'", fontSize: 13, marginTop: 3 }}>₦{item.price.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div onClick={() => toggleItemAvailability(item)} style={{ width: 36, height: 20, borderRadius: 10, background: item.available ? G.success : G.b5, cursor: "pointer", position: "relative", transition: "all .2s", opacity: togglingId === item.id ? 0.5 : 1 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: G.white, position: "absolute", top: 2, left: item.available ? 18 : 2, transition: "all .2s" }} />
            </div>
            <button onClick={() => setEditingItem(item)} style={{ ...btn("ghost", { padding: "6px 10px", fontSize: 11 }) }}>✏️</button>
            <button onClick={() => deleteItem(item.id)} style={{ ...btn("ghost", { padding: "6px 10px", fontSize: 11, color: G.danger }) }}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );

  if (tab === "profile") return <ProfileScreen onLogout={onLogout} />;

  // Vendor Dashboard (default)
  return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20, animation: "fadeUp .4s ease", maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: G.whiteDim, fontSize: 13 }}>Welcome back,</div>
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 30, fontWeight: 700, color: G.white }}>{restName} 🍲</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span onClick={() => setEditingRest(true)} style={{ color: G.gold, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>✏️ Edit</span>
          <div onClick={toggleOpen} style={{ background: isOpen ? `${G.success}22` : G.b4, border: `1px solid ${isOpen ? G.success : G.b5}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: isOpen ? G.success : G.whiteDim, cursor: "pointer", transition: "all .3s" }}>
            {isOpen ? "🟢 Open" : "⚫ Closed"}
          </div>
        </div>
      </div>
      {editingRest && <EditRestaurant restaurant={restaurant} onSaved={(r) => { setRestaurant(r); setEditingRest(false); }} />}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { l: "Today's Orders", v: String(orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length), ic: "📦", c: G.gold },
          { l: "Pending", v: String(orders.filter(o => o.status === "Pending").length), ic: "⏳", c: G.danger },
          { l: "Menu Items", v: String(menuItems.length), ic: "🍽️", c: G.goldLight },
          { l: "Avg Rating", v: restaurant?.rating ? `${restaurant.rating} ⭐` : "N/A", ic: "⭐", c: G.success },
        ].map((s: any) => (
          <div key={s.l} style={card()}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.ic}</div>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 22, fontWeight: 700, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 12, color: G.whiteDim, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={card()}>
        <STitle>Recent Orders</STitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {orders.slice(0, 3).map((o: any) => (
            <div key={o.id} style={{ padding: 14, background: G.b4, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, color: G.white, fontSize: 14 }}>{o.order_items?.map((i: any) => i.name).join(", ") || o.order_number}</div>
                <div style={{ fontSize: 12, color: G.whiteDim }}>{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge status={o.status} />
                <div style={{ color: G.gold, fontFamily: "'DM Mono'", fontSize: 13, marginTop: 4 }}>₦{o.total_amount?.toLocaleString()}</div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div style={{ textAlign: "center", color: G.whiteDim, fontSize: 13, padding: 20 }}>No orders yet</div>}
        </div>
      </div>
    </div>
  );
}
