import { MarcaA } from '@/components/ui/MarcaA';
import { Placeholder } from '@/components/ui/Placeholder';
import { SITE } from '@/lib/site';
import s from './Rodape.module.css';

/**
 * Rodapé. Curto de propósito: o clímax é o Ato 9, e nada aqui deve competir
 * com ele. Existe pelo que a lei e a boa fé pedem — identificação, canal de
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
          <Placeholder bloco>
            [CONTATO · e-mail, WhatsApp e perfis reais da Atlas]
          </Placeholder>
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
