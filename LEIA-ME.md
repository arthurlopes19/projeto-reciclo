# ReCiclo

Site de coleta de lixo e reciclagem das regiões **Parque Verde** e **Bengui**: calendário da coleta, guia de descarte e avisos. Aberto para todos, sem login.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html`, `styles.css`, `script.js` | O site |
| `data.js` | Conteúdo: horários das regiões, guia de descarte e avisos |
| `config.js` | Conexão com o banco (opcional) |
| `db.js` | Lê os horários das regiões do banco, se ele estiver ligado |
| `supabase/schema.sql` | Tabela e regras de segurança do banco (opcional) |
| `vercel.json` | Cabeçalhos de segurança para quando o site estiver na Vercel |
| `publicar/` | Cópia só dos arquivos do site, pronta para subir na hospedagem |

## Mudar os horários

Abra o `data.js` e preencha os dias e o horário de cada região, por exemplo:

```js
comum:    { dias: [1, 3, 5], hora: "19h" },   // segunda, quarta e sexta às 19h
seletiva: { dias: [2], hora: "8h" },          // terça às 8h
```

Dias da semana: 0 = domingo, 1 = segunda … 6 = sábado. Depois, suba o `data.js` atualizado na hospedagem.

## Banco de dados (opcional)

Se preferir mudar os horários sem mexer em arquivos:

1. Crie uma conta gratuita em <https://supabase.com> e clique em **New project**.
2. Abra **SQL Editor › New query**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Project Settings › API**, copie a **Project URL** e a chave **anon public** para o `config.js`.
4. Para mudar os horários, abra **Table Editor › regioes** no Supabase e edite a linha da região (ex.: `comum_dias` = `{1,3,5}`, `comum_hora` = `19h`).

Com o `config.js` vazio, o site usa os horários do `data.js`.

## Segurança

- **O site não tem login nem formulário**: os visitantes só leem as informações.
- **O banco é só leitura pelo site.** Não existe nenhuma regra que permita gravar, então ninguém consegue alterar ou apagar os horários pelo site, mesmo usando a chave pública.
- **A chave `anon` é pública por natureza** e pode ficar no `config.js`. **Nunca** coloque a chave `service_role` no site.
- **O site trata tudo o que vem do banco como texto**, então ninguém consegue injetar código por ele.
- **Content-Security-Policy** e cabeçalhos de segurança (`vercel.json`): as páginas só carregam scripts do próprio site e das bibliotecas usadas, e não podem ser embutidas em outros sites.

## Publicar

Suba os arquivos da pasta `publicar` em uma hospedagem de site estático (Vercel, Netlify ou GitHub Pages). Não precisa de servidor.
