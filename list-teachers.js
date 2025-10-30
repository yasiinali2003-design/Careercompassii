const { createClient } = require("@supabase/supabase-js");
const fs = require(fs);
function getEnvVar(key){
  try{
    const c=fs.readFileSync("/Users/yasiinali/careercompassi/.env.local","utf8");
    const lines=c.split(/\r?\n/);
    for(const line of lines){
      if(line.startsWith(key+"=")) return line.slice(key.length+1).trim();
    }
    return null;
  }catch(e){ return null }
}
const url=getEnvVar(NEXT_PUBLIC_SUPABASE_URL);
const key=getEnvVar(SUPABASE_SERVICE_ROLE_KEY);
if(!url||!key){ console.log(MISSING_ENVS); process.exit(0); }
const s=createClient(url,key);
(async()=>{
  const { data, error } = await s.from(teachers).select(id,
