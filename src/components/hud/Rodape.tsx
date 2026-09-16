import { MessageCircle, AtSign } from 'lucide-react';
import { MarcaA } from '@/components/ui/MarcaA';
import { SITE } from '@/lib/site';
import s from './Rodape.module.css';

/** wa.me exige o número sem formatação, com o código do país na frente. */
const WHATSAPP_URL = `https://wa.me/55${SITE.telefone.replace(/\D/g, '')}`;

/**
 * SITE.nome ("Atlas Software & Design") quebrado em partes só pra
 * destacar o "&" em laranja, sem duplicar o texto nem alterar o valor
 * original em site.ts.
 */
const [NOME_ANTES_E, NOME_DEPOIS_E] = SITE.nome.split(' & ');

/**
 * Rodapé. Curto de propósito: o clímax é o Ato 9, e nada aqui deve competir
 * com ele. Informações centralizadas, um único bloco de contato com ícone.
 */
export function Rodape() {
  return (
    <footer className={s.raiz} id="contato">
      <div className={`container ${s.interno}`}>
        <MarcaA className={s.logo} titulo="Atlas Software & Design" />

        <div className={s.marca}>
          <span className={s.nome}>
            {NOME_ANTES_E} <span className={s.amp}>&amp;</span> {NOME_DEPOIS_E}
          </span>
        </div>

        <ul className={s.contatos}>
          <li>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={s.contato}>
              <MessageCircle className={s.iconeContato} aria-hidden="true" />
              {SITE.telefone}
            </a>
          </li>
          <li>
            <a href={SITE.redes[0]} target="_blank" rel="noopener noreferrer" className={s.contato}>
              <AtSign className={s.iconeContato} aria-hidden="true" />
              {SITE.instagram}
            </a>
          </li>
          {/* [PLACEHOLDER · e-mail comercial real] terceira linha aqui,
              ícone Mail do lucide-react mais o endereço, assim que a Atlas
              confirmar um e-mail de contato. */}
        </ul>

        <span className={s.copyright}>
          © {new Date().getFullYear()} {SITE.nome}
        </span>
      </div>
    </footer>
  );
}
