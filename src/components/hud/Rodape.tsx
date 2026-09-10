import { MarcaA } from '@/components/ui/MarcaA';
import { Placeholder } from '@/components/ui/Placeholder';
import { SITE } from '@/lib/site';
import s from './Rodape.module.css';

/** wa.me exige o número sem formatação, com o código do país na frente. */
const WHATSAPP_URL = `https://wa.me/55${SITE.telefone.replace(/\D/g, '')}`;

/**
 * Rodapé. Curto de propósito: o clímax é o Ato 9, e nada aqui deve competir
 * com ele. Existe pelo que a lei e a boa fé pedem: identificação, canal de
 * contato e política de privacidade.
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

        <div className={s.coluna}>
          <h2 className={s.tituloColuna}>Contato</h2>
          <ul className={s.contatos}>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp {SITE.telefone}
              </a>
            </li>
            <li>
              <a href={SITE.redes[0]} target="_blank" rel="noopener noreferrer">
                Instagram {SITE.instagram}
              </a>
            </li>
          </ul>
          {!SITE.email && <Placeholder>[E-MAIL · endereço comercial real]</Placeholder>}
        </div>

        <div className={s.coluna}>
          <h2 className={s.tituloColuna}>Legal</h2>
          <Placeholder bloco>
            [LGPD · publicar política de privacidade e vincular aqui antes de coletar
            qualquer dado. Enquanto não existir formulário, não há coleta]
          </Placeholder>
          <Placeholder>[CNPJ · razão social e inscrição]</Placeholder>
        </div>
      </div>

      <div className={`container ${s.rodapinho}`}>
        <span>© {new Date().getFullYear()} {SITE.nome}</span>
        <span className={s.credito}>Feito no Brasil</span>
      </div>
    </footer>
  );
}
