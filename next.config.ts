import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Existe um package-lock.json na home do usuário; sem isto o Next elege a
  // home como raiz do workspace e o build vaza pra fora do projeto.
  outputFileTracingRoot: __dirname,
  // _legacy/ guarda o site antigo (Vite + vanilla). Nunca entra no build.
  outputFileTracingExcludes: { '*': ['./_legacy/**'] },
};

export default nextConfig;
