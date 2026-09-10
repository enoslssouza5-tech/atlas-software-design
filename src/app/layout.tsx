import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { LenisProvider } from '@/providers/LenisProvider';
import { AberturaProvider } from '@/providers/AberturaProvider';
import { SITE, jsonLd } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.tituloPadrao,
    template: `%s · ${SITE.nome}`,
  },
  description: SITE.descricao,
  applicationName: SITE.nome,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.nome,
    title: SITE.tituloPadrao,
    description: SITE.descricao,
    // [ASSET · og-image 1200x630 com o crachá da Atlas]
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: SITE.nome }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.tituloPadrao,
    description: SITE.descricao,
    images: ['/og.jpg'],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Failsafe. Se em 3s o JS de motion não tiver sinalizado que subiu,
 * a classe anime-failed revela tudo que estava escondido esperando GSAP.
 * A página nunca fica em branco por causa de animação.
 */
const FAILSAFE = `
(function(){
  var d = document.documentElement;
  window.__atlasFailsafe = setTimeout(function(){
    if (!window.__atlasReady) d.classList.add('anime-failed');
  }, 3000);
  window.addEventListener('error', function(e){
    if (e && e.message && /gsap|lenis|three/i.test(String(e.message))) {
      d.classList.add('anime-failed');
    }
  }, true);
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.idioma} className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        {/* General Sans (Fontshare). Se o CDN falhar, cai em Georgia/serif
            pelo próprio --font-display. Nada quebra. */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: FAILSAFE }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
        />
      </head>
      <body>
        <LenisProvider>
          <AberturaProvider>{children}</AberturaProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
