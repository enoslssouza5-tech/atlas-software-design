import { Preloader } from '@/components/preloader/Preloader';
import { Nav } from '@/components/hud/Nav';
import { Rodape } from '@/components/hud/Rodape';
import { Cracha } from '@/components/three/Cracha';
import { HeroFundo } from '@/components/hero/HeroFundo';
import { Ato1Hero } from '@/sections/Ato1Hero';
import { Ato2Dor } from '@/sections/Ato2Dor';
import { Ato3Solucao } from '@/sections/Ato3Solucao';
import { Ato4Beneficios } from '@/sections/Ato4Beneficios';
import { Ato5Projetos } from '@/sections/Ato5Projetos';
import { Ato6ProvaSocial } from '@/sections/Ato6ProvaSocial';
import { Ato7Stack } from '@/sections/Ato7Stack';
import { Ato8Oferta } from '@/sections/Ato8Oferta';
import { Ato9Convite } from '@/sections/Ato9Convite';

/**
 * A página como curta-metragem: preloader e nove atos, na ordem.
 *
 * A cena 3D fica fora do <main> de propósito: ela atravessa a narrativa
 * inteira em vez de pertencer a um ato só.
 */
export default function Home() {
  return (
    <>
      <Preloader />
      <HeroFundo />
      <Cracha />
      <Nav />

      <main id="conteudo">
        <Ato1Hero />
        <Ato2Dor />
        <Ato3Solucao />
        <Ato4Beneficios />
        <Ato5Projetos />
        <Ato6ProvaSocial />
        <Ato7Stack />
        <Ato8Oferta />
        <Ato9Convite />
      </main>

      <Rodape />
    </>
  );
}
