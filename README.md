# Danilo Cutrim — Neon

Link bio oficial com ênfase no álbum **Neon**, lançado em 13 de agosto de 2026.

## Conteúdo

- acesso ao álbum no Deezer e aos perfis oficiais de streaming;
- tracklist completa com links por faixa;
- agenda de shows atualizada pelo painel do artista;
- Instagram, YouTube e Spotify oficiais.

## Painel da agenda

O acesso fica em `/admin` e permite cadastrar Data, Local, Horário e Link do ingresso, além de excluir compromissos publicados. As credenciais e a chave de sessão ficam nas variáveis protegidas da Vercel; a agenda é persistida em um Vercel Blob privado e exibida automaticamente na página pública.

Para desenvolvimento local, copie as chaves de `.env.example` para `.env.local` e preencha os valores. Nunca versione credenciais.

## Desenvolvimento local

Instale a dependência e execute o ambiente local da Vercel para incluir as funções da agenda:

```sh
npm install
vercel dev
```

## Publicação

O projeto é versionado no GitHub e publicado pela Vercel CLI. As pastas `.vercel/` e `node_modules/`, além das credenciais locais, nunca devem ser commitidas.
