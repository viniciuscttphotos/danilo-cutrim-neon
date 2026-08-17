# Referência técnica

## Objetivo atual

Link bio mobile first para **Danilo Cutrim**, com o álbum **Neon** como conteúdo principal e uma agenda pública administrável. A página direciona o público para o álbum, perfis de streaming, faixas individuais, ingressos e redes oficiais; o artista atualiza os shows por um painel protegido.

## Arquitetura

Frontend estático com funções Node.js na Vercel e uma dependência de persistência:

- `index.html`: metadados de SEO/Open Graph, hero do álbum, plataformas, tracklist, manifesto, contêiner dinâmico da agenda, chamada final, rodapé e acesso discreto ao painel.
- `admin.html`: tela de login e painel do artista com formulário de cadastro e lista de compromissos.
- `styles.css`: design system inspirado na capa de `Neon`, layouts responsivos públicos e administrativos, animações, estados de foco e preferência de movimento reduzido.
- `script.js`: carregamento e renderização segura da agenda pública, animações de entrada, compartilhamento, ano automático e interações visuais.
- `admin.js`: estado de autenticação, login, logout, cadastro, listagem e exclusão de agendas.
- `api/session.js`: função HTTP de consulta, criação e encerramento da sessão administrativa.
- `api/agenda.js`: função HTTP que expõe leitura pública e protege criação/exclusão de compromissos.
- `lib/auth.js`: comparação segura de credenciais, assinatura e validação de sessão, cookie e verificação de mesma origem.
- `lib/agenda-store.js`: validação, ordenação, leitura e escrita da agenda no Vercel Blob privado; mantém as duas datas originais como dados iniciais quando o arquivo ainda não existe.
- `package.json` e `package-lock.json`: manifesto e resolução reproduzível da dependência `@vercel/blob`.
- `.env.example`: nomes das variáveis necessárias sem valores sensíveis.
- `assets/neon-cover.jpg`: capa oficial do álbum, usada no hero, na tracklist, no favicon e na imagem social.
- `assets/`: ativos herdados do molde permanecem no repositório, mas não são carregados pela interface atual.
- `vercel.json`: URLs limpas, limite de duração das funções, cache dos ativos e cabeçalhos HTTP de segurança.
- `robots.txt`: permite indexação por buscadores.
- `README.md`: instruções resumidas de manutenção e publicação.

## Estrutura e comunicação entre componentes

O navegador carrega `index.html`, que referencia `styles.css`, os ativos locais e `script.js` com `defer`. A agenda consulta `GET /api/agenda` e cria os cartões com APIs de DOM, sem injetar HTML recebido. O painel em `/admin` consulta `GET /api/session`; após o login, envia alterações autenticadas para a API. Conteúdo editorial, streaming e redes permanecem no HTML; a agenda exige JavaScript por ser dinâmica.

## Funcionalidades existentes

- Hero com capa, status de disponibilidade, contexto do lançamento, CTA principal, compartilhamento e dados rápidos.
- Plataformas: Deezer com link direto ao álbum; Spotify, Apple Music e YouTube com perfis oficiais.
- Tracklist de sete faixas, duração e link individual de cada música no Deezer.
- Manifesto editorial que contextualiza a sonoridade dançante, MPB/soul e influência de timbres dos anos 80.
- Agenda dinâmica, ordenada por data e horário, com link de ingresso e estado vazio acessível.
- Painel `/admin` com autenticação, cadastro de Data, Local, Horário e Link do ingresso, listagem e exclusão.
- Instagram, YouTube e Spotify oficiais no rodapé.
- Animações por `IntersectionObserver`, halo de ponteiro, inclinação de capas e botões magnéticos.
- Compartilhamento pela Web Share API, com cópia para a área de transferência como alternativa.
- Suporte a `prefers-reduced-motion`, link de salto e foco por teclado.
- Layout responsivo com estilos-base para telas pequenas e aprimoramentos em breakpoints `min-width`.

## Fluxo de dados e controle

1. `GET /api/agenda` lê `agenda/agenda.json` do Vercel Blob privado; quando ainda não existe, retorna as duas apresentações originais como estado inicial.
2. `script.js` ordena a resposta já validada no servidor e cria os cartões públicos com `textContent`, datas em português e links HTTP(S).
3. `POST /api/session` compara usuário e senha guardados no ambiente. Em caso de sucesso, devolve sessão assinada de 12 horas em cookie `HttpOnly`, `SameSite=Strict` e `Secure` em produção.
4. `POST /api/agenda` exige sessão e mesma origem, valida os quatro campos, gera um UUID, ordena a coleção e sobrescreve o JSON privado.
5. `DELETE /api/agenda?id=…` exige as mesmas garantias, remove o compromisso identificado e persiste a coleção restante.
6. `DELETE /api/session` encerra a sessão no navegador.
7. As interações editoriais anteriores continuam independentes: elementos `.reveal`, compartilhamento, ano automático, halo, inclinação e botões magnéticos.

## Integrações e publicação

- Deezer: álbum `1035402852` e faixas `4170289552` a `4170289612`.
- Spotify: perfil oficial `0SsKi9pXCgRat5JMAUIgFT`.
- Apple Music: perfil oficial `332722035`.
- YouTube: canal `@danilocutrim`.
- Instagram: perfil `@danilo_cutrim`.
- Agenda: Meaple/Casa Rockambole e Sympla/Dolores Club.
- Repositório: `https://github.com/viniciuscttphotos/danilo-cutrim-neon`.
- Produção: `https://danilo-cutrim-neon.vercel.app/`.
- O projeto Vercel `danilo-cutrim-neon` está conectado ao repositório GitHub de mesmo nome.
- O Vercel Blob privado `danilo-cutrim-agenda` está conectado aos ambientes Production, Preview e Development do projeto.
- `ADMIN_USERNAME`, `ADMIN_PASSWORD` e `SESSION_SECRET` são variáveis sensíveis em Production e Preview; valores locais ficam apenas em `.env.local`, ignorado pelo Git.
- O remote Git `origin` aponta para o repositório de Danilo Cutrim; o molde anterior foi preservado como `template-origin`.
- A pasta local `.vercel/` e credenciais de publicação não devem ser versionadas.

## Dependências

- `@vercel/blob` `^2.3.0`: leitura e escrita autenticadas no armazenamento privado, compatível com token/OIDC da Vercel.
- Node.js e npm para instalar dependências, validar scripts e executar as funções.
- Vercel CLI para desenvolvimento integrado, configuração das variáveis e publicação.
