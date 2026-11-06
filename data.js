/* =========================================================
   DADOS DO SITE — edite aqui sem mexer no resto do código.
   Dias da semana: 0 = Domingo, 1 = Segunda ... 6 = Sábado
   ========================================================= */

const CONTATO = {
  telefone: "---",
  whatsapp: "---",
};

// As duas regiões atendidas. Preencha os dias e o horário de cada coleta.
// Exemplo: comum: { dias: [1, 3, 5], hora: "19h" }  →  segunda, quarta e sexta às 19h
const REGIOES = [
  {
    id: "parque-verde",
    nome: "Parque Verde",
    comum:    { dias: [], hora: "" },
    seletiva: { dias: [], hora: "" },
  },
  {
    id: "bengui",
    nome: "Bengui",
    comum:    { dias: [], hora: "" },
    seletiva: { dias: [], hora: "" },
  },
];

// Resíduos que não vão no lixo comum
const CATEGORIAS = {
  eletronicos: { nome: "Eletrônicos" },
  pilhas:      { nome: "Pilhas e baterias" },
  moveis:      { nome: "Móveis velhos" },
  oleo:        { nome: "Óleo de cozinha" },
  lampadas:    { nome: "Lâmpadas" },
};

// tipo: "alerta" | "dica" | "comunicado". data no formato AAAA-MM-DD.
const AVISOS = [
  { tipo: "alerta", data: "2026-09-14", titulo: "Coleta atrasada devido à chuva",
    texto: "Por causa das fortes chuvas, a coleta de lixo comum pode atrasar até 3 horas hoje. Mantenha os sacos bem fechados e protegidos." },
  { tipo: "alerta", data: "2026-09-08", titulo: "Rua interditada para obras",
    texto: "A rua --- está parcialmente interditada. Deixe o lixo na esquina com a rua --- até o fim das obras." },
  { tipo: "dica", data: "2026-09-12", titulo: "Como lavar embalagens antes de reciclar",
    texto: "Não precisa gastar água limpa: use a água que sobrou da louça para enxaguar potes e latas. Retire restos de comida e deixe secar antes de separar." },
  { tipo: "comunicado", data: "2026-09-10", titulo: "Feriado de 12 de outubro",
    texto: "No feriado, a coleta de lixo comum funciona normalmente. A coleta seletiva será transferida para o dia seguinte." },
  { tipo: "dica", data: "2026-09-05", titulo: "Pilhas nunca vão no lixo comum",
    texto: "Pilhas e baterias contêm metais pesados que contaminam o solo e a água. Guarde em um pote fechado até encontrar um ponto de coleta especial." },
  { tipo: "dica", data: "2026-09-02", titulo: "Óleo de cozinha: guarde em garrafa PET",
    texto: "Espere esfriar, use um funil e armazene em garrafa PET bem tampada. Um litro de óleo pode contaminar milhares de litros de água." },
];

// Guia de descarte. destino: papel | plastico | vidro | metal | organico | rejeito | especial
// Para "especial", informe a categoria (chave de CATEGORIAS).
const GUIA = [
  { item: "Jornal e revista", destino: "papel" },
  { item: "Caixa de papelão", destino: "papel", dica: "Desmonte para ocupar menos espaço." },
  { item: "Caixa de pizza", destino: "papel", dica: "Só a parte limpa. A parte engordurada vai no lixo comum." },
  { item: "Papel toalha / guardanapo usado", destino: "rejeito", dica: "Papel sujo ou engordurado não recicla." },
  { item: "Caixa de leite (longa vida)", destino: "papel", dica: "Enxágue e amasse." },
  { item: "Garrafa PET", destino: "plastico", dica: "Enxágue, amasse e tampe." },
  { item: "Pote de margarina / iogurte", destino: "plastico", dica: "Retire os restos antes." },
  { item: "Sacola plástica", destino: "plastico" },
  { item: "Isopor", destino: "plastico", dica: "Limpo. Se estiver sujo de comida, vai no lixo comum." },
  { item: "Garrafa de vidro", destino: "vidro" },
  { item: "Pote de vidro (conserva)", destino: "vidro", dica: "Retire a tampa — ela vai no metal." },
  { item: "Copo ou espelho quebrado", destino: "rejeito", dica: "Embrulhe em jornal e escreva \"cuidado, vidro\"." },
  { item: "Lata de refrigerante / cerveja", destino: "metal", dica: "Amasse para ocupar menos espaço." },
  { item: "Lata de conserva / tampa de metal", destino: "metal" },
  { item: "Papel alumínio", destino: "metal", dica: "Limpo e amassado em bolinha." },
  { item: "Restos de comida", destino: "organico" },
  { item: "Casca de fruta e legume", destino: "organico", dica: "Ótimo para compostagem!" },
  { item: "Borra de café / sachê de chá", destino: "organico" },
  { item: "Fralda / absorvente", destino: "rejeito" },
  { item: "Papel higiênico", destino: "rejeito" },
  { item: "Bituca de cigarro", destino: "rejeito" },
  { item: "Pilha", destino: "especial", cat: "pilhas" },
  { item: "Bateria de celular", destino: "especial", cat: "pilhas" },
  { item: "Celular / computador / TV", destino: "especial", cat: "eletronicos" },
  { item: "Carregador e cabos", destino: "especial", cat: "eletronicos" },
  { item: "Lâmpada fluorescente / LED", destino: "especial", cat: "lampadas", dica: "Não quebre: contém mercúrio." },
  { item: "Óleo de cozinha usado", destino: "especial", cat: "oleo", dica: "Guarde em garrafa PET fechada." },
  { item: "Sofá / colchão / armário", destino: "especial", cat: "moveis", dica: "Agende a coleta de grandes volumes por telefone." },
];

const DESTINOS = {
  papel:    { nome: "Reciclável · Papel",    cor: "var(--papel)",     icone: "newspaper" },
  plastico: { nome: "Reciclável · Plástico", cor: "var(--plastico)",  icone: "cup-soda" },
  vidro:    { nome: "Reciclável · Vidro",    cor: "var(--vidro)",     icone: "wine" },
  metal:    { nome: "Reciclável · Metal",    cor: "var(--metal)",     icone: "cylinder" },
  organico: { nome: "Lixo comum · Orgânico", cor: "var(--organico)",  icone: "apple" },
  rejeito:  { nome: "Lixo comum · Rejeito",  cor: "var(--rejeito)",   icone: "trash-2" },
  especial: { nome: "Descarte especial",     cor: "var(--green-700)", icone: "triangle-alert" },
};
