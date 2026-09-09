'use client';

/**
 * Três luzes no máximo, conforme orçamento do CLAUDE.md.
 * Uma chave quente laranja, uma de preenchimento fria e um ambiente baixo
 * pra o preto não virar buraco. No mobile, só a chave.
 */
export function SceneLights({ mobile }: { mobile: boolean }) {
  if (mobile) {
    return (
      <>
        <ambientLight intensity={0.55} color="#2a2118" />
        <directionalLight position={[2.4, 3.2, 3.4]} intensity={2.6} color="#FFA347" />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.32} color="#1a1a22" />
      {/* chave quente — o laranja da marca virando luz, não área sólida */}
      <spotLight
        position={[2.8, 3.6, 3.2]}
        angle={0.62}
        penumbra={0.85}
        intensity={38}
        distance={16}
        color="#FFA347"
      />
      {/* preenchimento frio — separa o crachá do fundo quase preto */}
      <directionalLight position={[-3.4, -0.8, 2.2]} intensity={1.15} color="#7f93c9" />
    </>
  );
}
