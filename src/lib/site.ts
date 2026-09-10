/**
 * Dados institucionais da Atlas.
 *
 * Tudo que ainda não foi confirmado pelo cliente está marcado com PLACEHOLDER
 * e NÃO pode ir pro ar como se fosse real. Trocar por dado verdadeiro antes
 * de publicar: endereço, telefone, e-mail, CNPJ, redes e domínio final.
 */

export const SITE = {
  nome: 'Atlas Software & Design',
  /** [PLACEHOLDER · domínio final] trocar pelo domínio real da Atlas */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atlas.example.com',
  /**
   * Título padrão, usado no title tag, no OG e no Twitter Card. Ponto único
   * de correção: mudar aqui atualiza os três ao mesmo tempo.
   */
  tituloPadrao: 'Atlas Software & Design: websites, sistemas e automações',
  descricao:
    'Atlas Software & Design: desenvolvimento de websites, sistemas sob medida e automações para empresas no Brasil.',
  locale: 'pt_BR',
  idioma: 'pt-BR',
  /** [PLACEHOLDER · cidade/UV] definir se a Atlas quer foco local ou nacional */
  regiao: 'Brasil',
  /** [PLACEHOLDER · e-mail comercial real] */
  email: null as string | null,
  /** WhatsApp comercial da Atlas, formato exibido ao usuário */
  telefone: '77 99829-6908',
  /** Instagram comercial da Atlas, formato exibido ao usuário */
  instagram: '@Atlas_software_design',
  /** [PLACEHOLDER · demais perfis reais: LinkedIn, GitHub] o Instagram já entra por padrão */
  redes: ['https://www.instagram.com/Atlas_software_design/'] as string[],
} as const;

/**
 * JSON-LD. Campos sem dado confirmado ficam de fora do objeto em vez de
 * entrarem preenchidos com invenção. Schema com dado falso é pior que
 * schema incompleto.
 */
export function jsonLd() {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE.url}/#organizacao`,
    name: SITE.nome,
    description: SITE.descricao,
    url: SITE.url,
    areaServed: { '@type': 'Country', name: 'Brasil' },
    knowsLanguage: 'pt-BR',
    serviceType: [
      'Desenvolvimento de websites',
      'Desenvolvimento de sistemas sob medida',
      'Automação de processos',
    ],
  };

  if (SITE.email) base.email = SITE.email;
  if (SITE.telefone) base.telephone = SITE.telefone;
  if (SITE.redes.length) base.sameAs = SITE.redes;

  return base;
}
