# Progresso do projeto

## 2026-08-15 — Diagnóstico e documentação inicial

- **Arquivos analisados:** `index.html`, `styles.css`, `script.js`, `README.md`, `vercel.json`, `robots.txt` e ativos em `assets/`.
- **Trecho afetado:** documentação raiz criada antes da adaptação solicitada.
- **O que foi feito:** registrado o estado do projeto copiado da landing page de pré-save do BRAZA e documentadas sua arquitetura estática, interações e estratégia de publicação.
- **Por que:** preparar uma base confiável para converter o projeto em um link bio de Danilo Cutrim, com ênfase no álbum `Neon`, preservando rastreabilidade das mudanças.
- **Finalidade:** orientar a implementação, a validação visual e a publicação via GitHub e Vercel.

## 2026-08-15 — Conversão para o link bio de Danilo Cutrim

- **Arquivos alterados:** `index.html`, `styles.css`, `script.js`, `README.md`, `.gitignore` e `assets/neon-cover.jpg`.
- **Trechos afetados:** toda a interface pública, metadados sociais, conteúdo editorial, sistema visual, interações e documentação de uso.
- **O que foi feito:** a landing de pré-save do BRAZA foi substituída por um link bio mobile first de Danilo Cutrim, centrado no álbum `Neon`; foram incluídos capa oficial, informações do lançamento, CTA para o álbum, plataformas oficiais, tracklist completa, manifesto, agenda e redes sociais.
- **Por que:** o projeto copiado era apenas um molde e ainda continha identidade, conteúdo e links do BRAZA.
- **Finalidade:** conduzir o visitante rapidamente à audição de `Neon`, sem perder contexto artístico, descoberta das faixas, shows e canais oficiais.
- **Bug corrigido:** imagens com atributos intrínsecos de altura podiam conservar 1000 px no layout mobile; `height: auto` passou a assegurar proporção responsiva correta.
- **Segurança do repositório:** `.vercel/`, arquivos `.env*` e `.DS_Store` foram adicionados ao `.gitignore` para impedir o versionamento de credenciais e estado local.
- **Validação:** JavaScript verificado com `node --check`; ausência de overflow horizontal conferida em 375 px e 1425 px; hero, plataformas e animações revisados no navegador; capa carregada com 1000 × 1000 px.

## 2026-08-15 — Versionamento e publicação

- **Arquivos revisados:** `.gitignore`, `progress.md` e `techinical_referrence.md`.
- **O que foi feito:** criado e conectado o repositório público `viniciuscttphotos/danilo-cutrim-neon`; criado o projeto Vercel `danilo-cutrim-neon`, conectado ao GitHub e publicado em produção.
- **Finalidade:** disponibilizar o link bio em infraestrutura própria, com deploy reproduzível pelas CLIs solicitadas.
- **Validação em produção:** título, CTA do Deezer, capa em alta resolução, ausência de erros de console e ausência de overflow horizontal confirmados em `https://danilo-cutrim-neon.vercel.app/` no viewport móvel de 375 px.

## 2026-08-17 — Painel persistente para a agenda do artista

- **Arquivos alterados:** `index.html`, `script.js`, `styles.css`, `vercel.json`, `.gitignore`, `README.md`, `package.json`, `package-lock.json` e `.env.example`.
- **Arquivos criados:** `admin.html`, `admin.js`, `api/session.js`, `api/agenda.js`, `lib/auth.js` e `lib/agenda-store.js`.
- **Trechos afetados:** seção pública de agenda, rodapé, painel administrativo, autenticação, API de compromissos, persistência, configuração da Vercel e documentação de operação.
- **O que foi feito:** a agenda fixa foi substituída por uma lista dinâmica; foi criado um acesso discreto “Área do artista” no rodapé; o painel `/admin` recebeu login, formulário com Data, Local, Horário e Link do ingresso, listagem e exclusão de compromissos; as gravações passam por uma função autenticada e são salvas em armazenamento privado.
- **Por que:** permitir que o próprio artista publique novos shows sem editar o HTML ou depender do navegador em que o cadastro foi realizado.
- **Finalidade:** manter a agenda pública compartilhada e atualizada para todos os visitantes, com credenciais e dados de sessão fora do código enviado ao navegador.
- **Segurança:** sessão assinada em cookie `HttpOnly`, `SameSite=Strict` e `Secure` em produção; comparação de credenciais no servidor; validação de origem e dos quatro campos; bloqueio de protocolos não HTTP(S); armazenamento privado conectado ao projeto; segredos configurados como variáveis sensíveis da Vercel.
- **Compatibilidade:** interface e painel seguem a abordagem mobile first, com campos adequados a toque, rótulos acessíveis, mensagens de estado e aprimoramento para telas maiores.
- **Validação:** sintaxe dos scripts e funções aprovada; validações de dados testadas; leitura pública, login válido, recusa de senha incorreta, criação persistente e exclusão foram exercitados no ambiente local da Vercel; os registros temporários de teste foram removidos.
- **Publicação:** build aprovado e versão publicada em produção; página inicial, `/admin`, API pública da agenda e login válido responderam corretamente em `https://danilo-cutrim-neon.vercel.app/`, com dois compromissos reais preservados.

## 2026-08-17 — Correção responsiva do título do painel

- **Arquivo alterado:** `styles.css`.
- **Trechos afetados:** título “Próximos shows”, grade principal do painel, cabeçalho do formulário, cartões da agenda administrativa e breakpoints responsivos.
- **O que foi feito:** reduzida a escala tipográfica do título; adicionadas contenções de largura para colunas, cartões e campos; mantidos cabeçalho e cartões administrativos em uma coluna nas telas pequenas; a composição lateral passou a ser ativada apenas a partir de `56rem`, quando há espaço real para as duas colunas.
- **Por que:** no breakpoint anterior de `40rem`, as larguras mínimas das duas colunas e do espaçamento excediam a área útil e faziam o título invadir o quadro lateral.
- **Finalidade:** assegurar um painel genuinamente mobile first, sem sobreposição horizontal, preservando a hierarquia visual em celulares, tablets e desktops.
- **Validação visual:** em 360 px e 768 px, painel confirmado em coluna única e sem rolagem horizontal; em 1024 px, título e formulário permaneceram em colunas independentes com aproximadamente 61 px de separação.
- **Publicação:** build aprovado e correção implantada no endereço de produção `https://danilo-cutrim-neon.vercel.app/admin`.
