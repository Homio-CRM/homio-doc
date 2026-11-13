/**
 * Tutoriais mapeados e com roteiro escrito, ainda sem vídeo gravado. Aparecem na
 * seção "Em produção" do índice e na busca da capa: quem procura por um deles lê
 * "esse vídeo está em produção" com o link do texto, em vez de "não achei".
 * Quando o vídeo sair, o item sai daqui e entra como MDX em `content/universidade`.
 */
export interface TutorialEmProducao {
  tema: string;
  titulo: string;
  /** como o cliente fala do assunto, no mesmo espírito do `sintomas` dos clipes */
  sintomas: string[];
}

export const EM_PRODUCAO: TutorialEmProducao[] = [
  {
    tema: 'Conversas',
    titulo: 'Achar uma conversa que sumiu da caixa de entrada',
    sintomas: [
      'conversa sumiu',
      'conversa desapareceu',
      'não acho a conversa',
      'caixa de entrada vazia',
      'mensagem sumiu da caixa de entrada',
    ],
  },
];
