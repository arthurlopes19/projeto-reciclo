const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const $ = (sel) => document.querySelector(sel);

const icons = () => window.lucide && lucide.createIcons();
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const normalizar = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

/* ============ Contato ============ */
document.querySelectorAll("[data-contato]").forEach((el) => {
  el.textContent = CONTATO[el.dataset.contato] ?? "---";
});
$("#ano").textContent = new Date().getFullYear();

/* ============ Menu mobile ============ */
const nav = $("#nav");
const navToggle = $("#navToggle");
function setMenu(open) {
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  navToggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
  icons();
}
navToggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ============ Link ativo + botão topo ============ */
const links = [...document.querySelectorAll(".nav__link")];
const secoes = links.map((a) => document.querySelector(a.getAttribute("href")));
const toTop = $("#toTop");

function onScroll() {
  const y = window.scrollY + window.innerHeight * 0.35;
  let atual = secoes[0];
  secoes.forEach((s) => { if (s.offsetTop <= y) atual = s; });
  links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + atual.id));
  toTop.classList.toggle("is-visible", window.scrollY > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

/* ============ Animação de entrada ============ */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ============ Calendário por região ============ */
let regiaoAtual = store.get("reciclo:regiao") || REGIOES[0].id;

function renderRegioes() {
  if (!REGIOES.some((r) => r.id === regiaoAtual)) regiaoAtual = REGIOES[0].id;
  $("#regioes").innerHTML = REGIOES.map((r) => `
    <button class="regiao ${r.id === regiaoAtual ? "is-active" : ""}" role="tab" data-regiao="${escapeHtml(r.id)}"
      aria-selected="${r.id === regiaoAtual}" aria-controls="schedule">
      <i data-lucide="map-pin"></i>
      <span>${escapeHtml(r.nome)}</span>
    </button>`).join("");
}

function proximaColeta(dias, hojeIdx) {
  for (let d = 0; d < 7; d++) {
    const idx = (hojeIdx + d) % 7;
    if (dias.includes(idx)) return { idx, emDias: d };
  }
  return null;
}
function quando(p) {
  if (!p) return "A definir";
  if (p.emDias === 0) return "Hoje";
  if (p.emDias === 1) return "Amanhã";
  return `${DIAS[p.idx]} (em ${p.emDias} dias)`;
}

function renderCalendario() {
  const box = $("#schedule");
  const r = REGIOES.find((x) => x.id === regiaoAtual);
  const nome = escapeHtml(r.nome);

  if (!r.comum.dias.length && !r.seletiva.dias.length) {
    box.innerHTML = `<div class="empty"><i data-lucide="calendar-clock"></i><strong>Horários do ${nome} em breve</strong><span>Os dias e horários da coleta desta região ainda serão divulgados.</span></div>`;
    icons();
    return;
  }

  const comumHora = escapeHtml(r.comum.hora);
  const seletivaHora = escapeHtml(r.seletiva.hora);
  const hoje = new Date().getDay();
  const pc = proximaColeta(r.comum.dias, hoje);
  const ps = proximaColeta(r.seletiva.dias, hoje);

  const dias = [1, 2, 3, 4, 5, 6, 0].map((d) => {
    const pills = [];
    if (r.comum.dias.includes(d)) pills.push(`<span class="pill pill--comum"><strong>Lixo comum</strong>${comumHora}</span>`);
    if (r.seletiva.dias.includes(d)) pills.push(`<span class="pill pill--seletiva"><strong>Seletiva</strong>${seletivaHora}</span>`);
    return `
      <div class="day ${d === hoje ? "is-today" : ""}">
        <div class="day__name">${DIAS_CURTOS[d]}${d === hoje ? '<span class="day__today">Hoje</span>' : ""}</div>
        ${pills.join("") || '<span class="day__none">Sem coleta</span>'}
      </div>`;
  }).join("");

  box.innerHTML = `
    <div class="next">
      <div class="next__card next__card--comum">
        <span class="next__icon"><i data-lucide="trash-2"></i></span>
        <div>
          <div class="next__label">Próximo lixo comum</div>
          <div class="next__when">${quando(pc)}</div>
          ${pc && comumHora ? `<div class="next__sub">a partir das ${comumHora}</div>` : ""}
        </div>
      </div>
      <div class="next__card next__card--seletiva">
        <span class="next__icon"><i data-lucide="recycle"></i></span>
        <div>
          <div class="next__label">Próxima coleta seletiva</div>
          <div class="next__when">${quando(ps)}</div>
          ${ps && seletivaHora ? `<div class="next__sub">a partir das ${seletivaHora}</div>` : ""}
        </div>
      </div>
    </div>
    <div class="week">${dias}</div>
    <div class="schedule__actions">
      <button class="link-btn" id="btnCompartilhar"><i data-lucide="share-2"></i> Compartilhar</button>
      <button class="link-btn" id="btnImprimir"><i data-lucide="printer"></i> Imprimir</button>
    </div>`;
  icons();

  $("#btnImprimir").onclick = () => window.print();
  $("#btnCompartilhar").onclick = async () => {
    const fmt = (c) => c.dias.length ? `${c.dias.map((d) => DIAS_CURTOS[d]).join(", ")}${c.hora ? " às " + c.hora : ""}` : "a definir";
    const texto = `Coleta no ${r.nome}:\n• Lixo comum: ${fmt(r.comum)}\n• Seletiva: ${fmt(r.seletiva)}`;
    try {
      if (navigator.share) await navigator.share({ title: "ReCiclo", text: texto });
      else { await navigator.clipboard.writeText(texto); $("#btnCompartilhar").lastChild.textContent = " Copiado!"; }
    } catch {}
  };
}

$("#regioes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-regiao]");
  if (!b) return;
  regiaoAtual = b.dataset.regiao;
  store.set("reciclo:regiao", regiaoAtual);
  renderRegioes();
  renderCalendario();
  icons();
});
renderRegioes();
renderCalendario();

/* ============ Guia de descarte ============ */
const busca = $("#guiaBusca");
const sugestoes = ["Pilha", "Caixa de pizza", "Isopor", "Óleo", "Lâmpada", "Espelho"];
$("#guiaSugestoes").innerHTML = "Experimente: " + sugestoes.map((s) => `<button type="button">${s}</button>`).join("");
$("#guiaSugestoes").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") { busca.value = e.target.textContent; renderGuia(); busca.focus(); }
});

function renderGuia() {
  const ul = $("#guiaResultados");
  const q = normalizar(busca.value.trim());
  if (!q) { ul.innerHTML = ""; return; }

  const achados = GUIA.filter((g) => normalizar(g.item).includes(q)).slice(0, 6);
  if (!achados.length) {
    ul.innerHTML = `<li class="guide__empty">Não achamos "${escapeHtml(busca.value)}". Na dúvida, ligue para <strong>${escapeHtml(CONTATO.telefone)}</strong>.</li>`;
    return;
  }
  ul.innerHTML = achados.map((g) => {
    const d = DESTINOS[g.destino];
    const especial = g.destino === "especial";
    const destino = especial ? `${d.nome} · ${CATEGORIAS[g.cat].nome}` : d.nome;
    const dica = g.dica || (especial ? "Não vai no lixo comum nem na coleta seletiva." : "");
    return `
      <li class="result">
        <span class="result__swatch" style="background:${d.cor}"><i data-lucide="${d.icone}"></i></span>
        <div class="result__body">
          <div class="result__item">${g.item}</div>
          ${dica ? `<div class="result__dica">${dica}</div>` : ""}
        </div>
        <span class="result__dest" style="color:${d.cor};background:color-mix(in srgb, ${d.cor} 12%, white)">${destino}</span>
      </li>`;
  }).join("");
  icons();
}
busca.addEventListener("input", renderGuia);

/* ============ Avisos ============ */
const TIPOS = {
  alerta:     { nome: "Alerta",     plural: "Alertas",     icone: "triangle-alert" },
  dica:       { nome: "Dica",       plural: "Dicas",       icone: "lightbulb" },
  comunicado: { nome: "Comunicado", plural: "Comunicados", icone: "info" },
};
let filtroAviso = "todos";
const fmtData = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function renderAvisos() {
  const contagem = (t) => AVISOS.filter((a) => t === "todos" || a.tipo === t).length;
  const opcoes = [["todos", "Todos", null], ...Object.entries(TIPOS).map(([k, t]) => [k, t.plural, t.icone])];
  $("#avisoFiltros").innerHTML = opcoes.map(([k, nome, ic]) =>
    `<button class="chip ${k === filtroAviso ? "is-active" : ""}" data-f="${k}" aria-pressed="${k === filtroAviso}">
      ${ic ? `<i data-lucide="${ic}"></i>` : ""}${nome} <span class="chip__count">${contagem(k)}</span>
    </button>`).join("");

  // Alertas primeiro, depois do mais recente para o mais antigo
  const lista = AVISOS
    .filter((a) => filtroAviso === "todos" || a.tipo === filtroAviso)
    .sort((a, b) => (b.tipo === "alerta") - (a.tipo === "alerta") || b.data.localeCompare(a.data));

  const agora = Date.now();
  $("#avisoLista").innerHTML = lista.map((a) => {
    const t = TIPOS[a.tipo];
    const data = new Date(a.data + "T12:00:00");
    const novo = agora - data.getTime() < 7 * 864e5;
    return `
      <article class="aviso aviso--${a.tipo}">
        ${novo ? '<span class="aviso__novo">NOVO</span>' : ""}
        <div class="aviso__head">
          <span class="aviso__type"><i data-lucide="${t.icone}"></i>${t.nome}</span>
          <time class="aviso__date" datetime="${a.data}">${fmtData.format(data)}</time>
        </div>
        <h3>${a.titulo}</h3>
        <p>${a.texto}</p>
      </article>`;
  }).join("");
  icons();
}
$("#avisoFiltros").addEventListener("click", (e) => {
  const b = e.target.closest("[data-f]");
  if (b) { filtroAviso = b.dataset.f; renderAvisos(); }
});

/* ============ Início ============ */
renderAvisos();
icons();
onScroll();

// Chamado pelo db.js quando os horários das regiões chegam do banco
window.recarregarDados = () => {
  renderRegioes();
  renderCalendario();
  icons();
};
