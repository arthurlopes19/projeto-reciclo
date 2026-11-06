/* Carrega os horários das regiões do Supabase. Sem configuração, fica com o data.js. */

function conectarBanco() {
  const { url, anonKey } = window.SUPABASE_CONFIG || {};
  if (!url || !anonKey || !window.supabase) return null;
  return window.supabase.createClient(url, anonKey);
}

(async () => {
  const db = conectarBanco();
  if (!db || !window.recarregarDados) return;
  try {
    const { data, error } = await db.from("regioes").select("*");
    if (error) throw error;
    data.forEach((row) => {
      const r = REGIOES.find((x) => x.id === row.id);
      if (!r) return;
      r.nome = row.nome;
      r.comum = { dias: row.comum_dias || [], hora: row.comum_hora || "" };
      r.seletiva = { dias: row.seletiva_dias || [], hora: row.seletiva_hora || "" };
    });
    window.recarregarDados();
  } catch (e) {
    console.warn("ReCiclo: não foi possível ler o banco, usando dados locais.", e.message);
  }
})();
