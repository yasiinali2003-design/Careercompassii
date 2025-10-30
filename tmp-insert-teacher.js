const { createClient } = require("@supabase/supabase-js");
const fs = require(fs);
function getEnvVar(key){
  try{ const c=fs.readFileSync("/Users/yasiinali/careercompassi/.env.local","utf8"); const m=c.match(new RegExp(`${key}=(.+)`)); return m?m[1].trim():null; }catch(e){ return null }
}
const url=getEnvVar(NEXT_PUBLIC_SUPABASE_URL);
const key=getEnvVar(SUPABASE_SERVICE_ROLE_KEY);
if(!url||!key){ console.error(Missing
