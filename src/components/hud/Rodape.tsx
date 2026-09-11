import { MessageCircle, AtSign } from 'lucide-react';
import { MarcaA } from '@/components/ui/MarcaA';
import { SITE } from '@/lib/site';
import s from './Rodape.module.css';

/** wa.me exige o número sem formatação, com o código do país na frente. */
const WHATSAPP_URL = `https://wa.me/55${SITE.telefone.replace(/\D/g, '')}`;

/**
 * Rodapé. Curto de propósito: o clímax é o Ato 9, e nada aqui deve competir
 * com ele. Informações centralizadas, um único bloco de contato com ícone.
 */
export function Rodape() {
  return (
    <footer className={s.raiz} id="contato">
      <div className={`container ${s.interno}`}>
        <div className={s.marca}>
          <MarcaA className={s.icone} titulo="Atlas Software & Design" />
          <p className={s.assinatura}>
            {SITE.nome}
            <span className={s.linhaSecundaria}>Websites, sistemas e automações</span>
          </p>
        </div>

        <ul className={s.contatos}>
          <li>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className={s.iconeContato} aria-hidden="true" />
              WhatsApp {SITE.telefone}
            </a>
          </li>
          <li>
            <a href={SITE.redes[0]} target="_blank" rel="noopener noreferrer">
              <AtSign className={s.iconeContato} aria-hidden="true" />
              {SITE.instagram}
            </a>
          </li>
        </ul>
      </div>

      <div className={`container ${s.rodapinho}`}>
        <span>© {new Date().getFullYear()} {SITE.nome}</span>
        <span className={s.credito}>Feito no Brasil</span>
      </div>
    </footer>
  );
}
