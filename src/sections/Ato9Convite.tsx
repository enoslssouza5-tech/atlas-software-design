'use client';

import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Botao } from '@/components/ui/Botao';
import { SITE } from '@/lib/site';
import s from './Ato9Convite.module.css';

/**
 * ATO 9: CONVITE
 *
 * Clímax. Nada de segundo CTA competindo aqui.
 *
 * O crachá não reaparece: ele vive só no Ato 1, estático, e o giro dele já
 * aconteceu lá. O headline repete o da abertura de propósito, a página
 * termina no mesmo problema com que começou, agora com um caminho concreto
 * pra resolvê-lo.
 */

/** wa.me exige o número sem formatação, com o código do país na frente. */
const WHATSAPP_URL = `https://wa.me/55${SITE.telefone.replace(/\D/g, '')}`;

export function Ato9Convite() {
  return (
    <section className={s.raiz} id="ato-convite" aria-labelledby="ato-convite-rotulo">
      <div className={s.brilho} aria-hidden="true" />

      <div className={`container ${s.interno}`}>
        <div className={s.marcacao}>
          <span className={s.numero}>09</span>
          <span className={s.traco} aria-hidden="true" />
          <span className={s.nome} id="ato-convite-rotulo">
            Convite
          </span>
        </div>

        <Eyebrow>Sua vez de decidir</Eyebrow>
        <SplitWords
          texto="Você não perde cliente por falta de anúncio. Perde quando ele cai entre fornecedores que não se falam."
          como="h2"
          className={s.titulo}
        />

        <Reveal className={s.corpo} distancia={28} duracao={0.68}>
          <p>Conta o problema. A Atlas diz se resolve.</p>
        </Reveal>

        <Reveal className={s.acao} duracao={0.82}>
          <div>
            <Botao href="#contato" aria="Falar com a Atlas">
              Falar com a Atlas
            </Botao>
            <p className={s.micro}>Sem compromisso, resposta em até 24 horas.</p>
            <p className={s.contatos}>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp {SITE.telefone}
              </a>
              <span className={s.separador} aria-hidden="true" />
              <a href={SITE.redes[0]} target="_blank" rel="noopener noreferrer">
                Instagram {SITE.instagram}
              </a>
            </p>
          </div>
        </Reveal>

        <Reveal className={s.ps} distancia={22} duracao={0.68} atraso={0.1}>
          <p>
            O site bonito, o anúncio rodando e o sistema recebendo lead só valem alguma
            coisa se as três pontas conversam entre si. É exatamente isso que a Atlas
            entrega, sob o mesmo teto, com o que foi combinado por escrito antes de
            qualquer cobrança.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
