/* =========================================================
   CONEXÃO COM O BANCO (Supabase)
   Pegue os dois valores em: Supabase > Project Settings > API.
   - url:     "Project URL"
   - anonKey: chave "anon public"
   A chave "anon" pode ficar no site: quem protege os dados são as
   regras de segurança do banco (supabase/schema.sql).
   NUNCA coloque aqui a chave "service_role".
   Com os campos vazios, o site usa os dados do data.js.
   ========================================================= */

window.SUPABASE_CONFIG = {
  url: "",
  anonKey: "",
};
