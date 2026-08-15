# Referência técnica

## Objetivo atual

Link bio estático, mobile first, para **Danilo Cutrim**, com o álbum **Neon** como conteúdo principal. A página direciona o público para o álbum, perfis de streaming, faixas individuais, ingressos e redes oficiais.

## Arquitetura

Aplicação estática sem etapa de build e sem gerenciador de pacotes:

- `index.html`: metadados de SEO/Open Graph, hero do álbum, plataformas, tracklist, manifesto, agenda, chamada final e rodapé.
- `styles.css`: design system inspirado na capa de `Neon`, layouts responsivos, animações, estados de foco e preferência de movimento reduzido.
- `script.js`: animações de entrada, compartilhamento nativo/cópia de link, ano automático, halo de ponteiro, inclinação de imagens e botões magnéticos.
- `assets/neon-cover.jpg`: capa oficial do álbum, usada no hero, na tracklist, no favicon e na imagem social.
- `assets/`: ativos herdados do molde permanecem no repositório, mas não são carregados pela interface atual.
- `vercel.json`: URLs limpas, cache dos ativos e cabeçalhos HTTP de segurança.
- `robots.txt`: permite indexação por buscadores.
- `README.md`: instruções resumidas de manutenção e publicação.

## Estrutura e comunicação entre componentes

O navegador carrega `index.html`, que referencia `styles.css`, os ativos locais e `script.js` com `defer`. O JavaScript localiza elementos por atributos `data-*` e classes CSS e aplica aprimoramentos progressivos. Todo o conteúdo e todos os links essenciais existem no HTML e permanecem acessíveis sem JavaScript.

## Funcionalidades existentes

- Hero com capa, status de disponibilidade, contexto do lançamento, CTA principal, compartilhamento e dados rápidos.
- Plataformas: Deezer com link direto ao álbum; Spotify, Apple Music e YouTube com perfis oficiais.
- Tracklist de sete faixas, duração e link individual de cada música no Deezer.
- Manifesto editorial que contextualiza a sonoridade dançante, MPB/soul e influência de timbres dos anos 80.
- Agenda com Casa Rockambole em São Paulo (21/08/2026) e Dolores Club no Rio de Janeiro (28/08/2026).
- Instagram, YouTube e Spotify oficiais no rodapé.
- Animações por `IntersectionObserver`, halo de ponteiro, inclinação de capas e botões magnéticos.
- Compartilhamento pela Web Share API, com cópia para a área de transferência como alternativa.
- Suporte a `prefers-reduced-motion`, link de salto e foco por teclado.
- Layout responsivo com estilos-base para telas pequenas e aprimoramentos em breakpoints `min-width`.

## Fluxo de dados e controle

1. O HTML fornece conteúdo, links e atributos de comportamento.
2. Elementos `.reveal` são exibidos conforme entram na viewport; sem `IntersectionObserver` ou com movimento reduzido, aparecem imediatamente.
3. O botão `data-share` aciona o compartilhamento nativo; quando indisponível, copia a URL atual.
4. Elementos `data-year` recebem o ano atual.
5. Em dispositivos com ponteiro fino e movimento permitido, as coordenadas do cursor atualizam variáveis CSS e os elementos `data-tilt`/`.magnetic` recebem transformações transitórias.

## Integrações e publicação

- Deezer: álbum `1035402852` e faixas `4170289552` a `4170289612`.
- Spotify: perfil oficial `0SsKi9pXCgRat5JMAUIgFT`.
- Apple Music: perfil oficial `332722035`.
- YouTube: canal `@danilocutrim`.
- Instagram: perfil `@danilo_cutrim`.
- Agenda: Meaple/Casa Rockambole e Sympla/Dolores Club.
- Hospedagem prevista na Vercel por meio da CLI.
- Operações de repositório previstas por meio da GitHub CLI.
- A pasta local `.vercel/` e credenciais de publicação não devem ser versionadas.

## Dependências

Não há dependências JavaScript instaladas. A execução local exige apenas um servidor HTTP estático; a produção é servida diretamente pela Vercel.
