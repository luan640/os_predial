// Paleta categórica validada (CVD-safe) para os gráficos do painel.
// Validado via dataviz skill (scripts/validate_palette.js) — não trocar
// sem revalidar: ordem dos tons é o mecanismo de segurança, não estética.
export const CHART_COLORS = {
  pendente: "#2a78d6", // azul — rascunho/enviado/aprovado
  emAndamento: "#eb6834", // laranja
  concluido: "#1baf7a", // verde-água
  atrasado: "#e34948", // vermelho
};

export const CHART_GRID = "#e1e0d9";
export const CHART_MUTED = "#898781";
