const { createClient } = require("@supabase/supabase-js");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing Supabase envs"); process.exit(1); }
const s = createClient(url, key);
(async () => {
  const wanted = ["teachers","classes","pins","results","rate_limits"];
  const exist = {};
  for (const t of wanted) {
    try {
      const { error } = await s.from(t).select("id").limit(1);
      if (error && (error.code || "").toUpperCase()===PGRST116) exist[t]=false; else exist[t]=true;
    } catch { exist[t]=false; }
  }
  let rpcExists = true;
  try {
    const { error, data, status } = await s.rpc(get_class_results_owner, { p_class_id: x, p_teacher_id: y });
    rpcExists = status !== 404; // 404 when RPC not found
  } catch (e) {
    rpcExists = (e && e.status !== 404);
  }
  console.log(JSON.stringify({ tables: exist, rpc_get_class_results_owner: rpcExists }));
  process.exit(0);
})().catch(e=>{ console.error(e.message || e); process.exit(1);});
