import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const G = {
  gold:"#C9A84C",goldDark:"#9A7A2E",goldGlow:"rgba(201,168,76,0.15)",
  black:"#0A0A0A",b3:"#1A1A1A",b4:"#242424",b5:"#2E2E2E",
  white:"#F5F0E8",whiteDim:"rgba(245,240,232,0.55)",
  danger:"#E05555",success:"#4CAF7A",
};

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event from the redirect URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
        setChecking(false);
      } else if (event === "SIGNED_IN" && session) {
        // Recovery token processed, session available
        setSessionReady(true);
        setChecking(false);
      }
    });

    // Also check if there's already a session (user may have landed here with a valid session)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
      // Give a short delay for the auth state change to fire from URL hash
      setTimeout(() => setChecking(false), 2000);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (!password || password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    // Sign out after password update so user logs in fresh
    await supabase.auth.signOut();
    setDone(true);
  };

  if (done) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:G.black,padding:20}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{fontSize:64,marginBottom:16}}>✅</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:G.gold,marginBottom:12}}>Password Updated!</div>
        <div style={{color:G.whiteDim,fontSize:14,marginBottom:24}}>You can now sign in with your new password.</div>
        <a href="/" style={{display:"inline-block",padding:"12px 24px",borderRadius:10,background:`linear-gradient(135deg,${G.gold},${G.goldDark})`,color:G.black,fontWeight:600,textDecoration:"none",fontSize:14}}>Go to Login →</a>
      </div>
    </div>
  );

  if (checking) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:G.black}}>
      <div style={{color:G.whiteDim,fontSize:14}}>Verifying reset link…</div>
    </div>
  );

  if (!sessionReady) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:G.black,padding:20}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{fontSize:64,marginBottom:16}}>⚠️</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:G.gold,marginBottom:12}}>Invalid or Expired Link</div>
        <div style={{color:G.whiteDim,fontSize:14,marginBottom:24}}>This password reset link has expired or is invalid. Please request a new one.</div>
        <a href="/" style={{display:"inline-block",padding:"12px 24px",borderRadius:10,background:`linear-gradient(135deg,${G.gold},${G.goldDark})`,color:G.black,fontWeight:600,textDecoration:"none",fontSize:14}}>Go to Login →</a>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:G.black,padding:20,fontFamily:"'DM Sans',sans-serif",color:G.white}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:G.gold}}>Reset Password</div>
          <div style={{color:G.whiteDim,fontSize:13,marginTop:6}}>Enter your new password below</div>
        </div>
        <div style={{background:G.b3,border:`1px solid ${G.b5}`,borderRadius:16,padding:24}}>
          {error && <div style={{background:`${G.danger}22`,border:`1px solid ${G.danger}`,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13,color:G.danger}}>{error}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:11,fontWeight:600,color:G.whiteDim,letterSpacing:".06em",textTransform:"uppercase"}}>New Password</div>
            <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
              style={{width:"100%",padding:"13px 16px",background:G.b4,border:`1.5px solid ${G.b5}`,borderRadius:10,color:G.white,fontSize:14,outline:"none"}}/>
            <div style={{fontSize:11,fontWeight:600,color:G.whiteDim,letterSpacing:".06em",textTransform:"uppercase"}}>Confirm Password</div>
            <input type="password" placeholder="••••••••" value={confirm} onChange={e=>setConfirm(e.target.value)}
              style={{width:"100%",padding:"13px 16px",background:G.b4,border:`1.5px solid ${G.b5}`,borderRadius:10,color:G.white,fontSize:14,outline:"none"}}/>
            <button onClick={handleReset} disabled={loading}
              style={{width:"100%",padding:"14px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${G.gold},${G.goldDark})`,color:G.black,fontWeight:600,fontSize:14,cursor:"pointer",opacity:loading?0.7:1}}>
              {loading ? "Updating…" : "Update Password →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
