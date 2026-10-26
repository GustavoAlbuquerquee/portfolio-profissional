# Guia de capturas dos projetos

O enunciado do Laboratório 01 pede, para cada projeto da linha do tempo, uma
"imagem ou GIF com o projeto em funcionamento (telas, login, interações)".
Todas as imagens de `public/projects/` já são capturas reais (JPEG 1600 x 1000,
16:10). Este guia fica como referência para trocar ou atualizar uma delas
mantendo o mesmo padrão.

## 1. Especificação técnica (vale para todos)

| Item | Valor |
| --- | --- |
| Proporção | **16:10** (o card do site usa `aspect-16/10` com `object-cover`; outra proporção é cortada) |
| Resolução alvo | **1600 x 1000 px** (nítido em telas retina) |
| Imagem estática | **JPEG** (qualidade 88, progressivo) ou PNG |
| Interação | **GIF** animado (pode ser menor que o alvo, desde que 16:10: 1280x800 ou 1200x750) |
| Peso máximo sugerido | JPEG até **500 KB**; PNG até **800 KB**; GIF até **5 MB** (idealmente 3 MB) |
| Local | `public/projects/` |

### Nome exato dos arquivos

O nome é o `id` do projeto mais a extensão. Use o mesmo `id` de `src/data/projects.ts`:

| Projeto | Estático | Se for GIF |
| --- | --- | --- |
| Primor Móveis | `primor-moveis.jpg` | `primor-moveis.gif` |
| Arquiteck | `arquiteck.jpg` | `arquiteck.gif` |
| Estagi.ON | `estagi-on.jpg` | `estagi-on.gif` |
| YesAgile | `yesagile.jpg` | `yesagile.gif` |
| Vitalis | `vitalis.jpg` | `vitalis.gif` |

Use **um** arquivo por projeto. Depois de colocar o arquivo, atualize o campo
`image` do projeto em `src/data/projects.ts` (por exemplo
`image: "/projects/yesagile.gif",`). O script de validação (seção 5) mostra a
linha exata. Se a extensão mudar (de `.jpg` para `.gif`, por exemplo), apague o
arquivo antigo.

## 2. O que capturar em cada projeto

O critério do enunciado é mostrar o sistema **em funcionamento**: telas reais,
login, interações. Prefira sempre uma tela com conteúdo (dados preenchidos) a
uma tela vazia ou de erro.

### Primor Móveis (`primor-moveis`) — GIF

Dois lados do projeto: o site e a automação. O mais forte é mostrar os dois.

- **Opção recomendada (GIF, ~15 s):** a conversa no WhatsApp Web com o fluxo do
  n8n respondendo (saudação, triagem, encaminhamento), terminando na passagem
  para a equipe. Mostra a automação, que é o diferencial.
- **Alternativa (PNG):** a página inicial do site já publicado, com a vitrine
  de móveis visível, sem banner de cookies cobrindo.
- **Dica:** use um número de teste seu, não de cliente.

### Arquiteck (`arquiteck`) — PNG (ou GIF curto)

- **Tela:** o **painel/funil de orçamentos** com vários clientes distribuídos
  nos estágios (kanban ou lista por estágio). É a tela que resume o que o CRM
  faz e prova que há dados e fluxo reais.
- **Por quê:** o enunciado valoriza telas e interações; o funil mostra as duas
  coisas e é mais informativo que a tela de login.
- **Se quiser GIF:** 10 a 12 s arrastando um cartão de um estágio para o seguinte.
- **Dica:** use clientes fictícios.

### Estagi.ON (`estagi-on`) — PNG, ou GIF se couber o login

- **Tela:** a **listagem de vagas de estágio** logado como aluno, com filtros
  visíveis e algumas vagas carregadas.
- **Por quê:** é a tela central da plataforma e já mostra que existe sessão
  autenticada.
- **Para somar com "login":** um GIF de ~12 s: tela de login, entrada, chegada
  na listagem, aplicação de um filtro. Cobre "login" e "interação" de uma vez.

### YesAgile (`yesagile`) — GIF (prioridade)

- **Cena:** conversa no WhatsApp com o agente conversacional (o aluno ou
  responsável pergunta algo, o agente responde), seguida de um corte para a
  **planilha** recebendo ou fornecendo o dado (a linha aparecendo na planilha).
- **Por quê:** o valor do projeto é a integração conversa ↔ planilha; um print
  estático não mostra isso. O GIF prova o funcionamento de ponta a ponta.
- **Roteiro (15 a 20 s):** pergunta → resposta do agente → alternar para a
  planilha → mostrar a linha gravada.
- **Alternativa (PNG):** página inicial do site da escola, se o GIF não for possível.

### Vitalis (`vitalis`) — PNG

- **Tela:** o **painel principal do Sistema de Informação Hospitalar** logado,
  idealmente a tela de **prontuário ou lista de pacientes** com registros.
- **Por quê:** o trabalho é um sistema de informação; a tela com dados
  estruturados comunica o escopo (cadastros, fluxo hospitalar) melhor que um
  login isolado.
- **Se for aplicação desktop/console:** capture a janela com a tela mais
  completa e enquadre em 16:10 (veja o recorte na seção 3).
- **Dica:** use pacientes fictícios. Nunca dados de pessoas reais.

> O projeto `portfolio-profissional` (o próprio site) também tem uma imagem. Se
> quiser trocá-la, siga a mesma especificação com o nome `portfolio-profissional.jpg`.
> A página inicial em modo claro ou escuro já serve.

## 3. Como capturar no Windows 11

### PNG: Ferramenta de Captura (Win+Shift+S)

1. Deixe a janela do navegador no tamanho certo antes de capturar. Para ter
   16:10 exato, abra o DevTools (F12) → modo dispositivo (Ctrl+Shift+M) →
   "Responsivo" e digite **1600 x 1000** (ou **800 x 500** com a escala de
   dispositivo em 2x). A captura sai na proporção certa sem recorte.
2. Pressione **Win+Shift+S**, escolha **retângulo** e selecione a área da página
   (sem barra de endereço, abas ou barra de tarefas).
3. Clique na notificação que aparece para abrir o editor. Em **Recortar**
   (ícone de corte), confira se a proporção está em 16:10; use "Proporção" se
   disponível.
4. **Salvar como** (Ctrl+S), tipo **PNG**, com o nome exato da tabela.
5. Se a imagem saiu menor que 1600 px de largura, refaça com zoom de
   dispositivo maior em vez de ampliar depois (ampliar borra).

Ajustes úteis: em **Configurações** da Ferramenta de Captura, ative "Salvar
capturas de tela automaticamente" se quiser guardar os originais, e desative o
atraso para a captura sair na hora.

### GIF: ScreenToGif

1. Baixe o ScreenToGif em <https://www.screentogif.com> (versão "Installer" ou
   portátil).
2. Abra e clique em **Gravador**. Arraste a moldura sobre a área. No campo de
   tamanho da janela do gravador, digite **1280 x 800** (16:10).
3. **FPS: 15** (suficiente e mantém o arquivo leve). Clique em **Gravar** (F7),
   faça a interação com calma e pare (F8).
4. No **Editor**:
   - corte o início e o fim sobrando (Editar → Remover quadros);
   - em **Editar → Redimensionar** mantenha a proporção 16:10 se precisar reduzir;
   - em **Editar → Reduzir contagem de quadros** (ou remova quadros duplicados)
     para baixar o peso;
   - use **Editar → Atraso** para deixar uma pausa de 1 a 2 s no último quadro,
     para o resultado ficar legível antes de reiniciar o loop.
5. **Salvar como → GIF**. Em codificador, escolha **Gifski** ou "Sistema" e
   deixe o **loop infinito** ativado. Confira o peso final (alvo: até 5 MB).
6. Nome exato: `<id-do-projeto>.gif`.

Se o GIF passar de 5 MB: reduza a duração, o FPS (12) ou a resolução
(1200 x 750), sempre mantendo 16:10.

## 4. Dicas para a captura não ficar amadora

- **Janela anônima** (Ctrl+Shift+N): sem extensões ativas, sem barra de
  favoritos e sem sugestões de autopreenchimento.
- **Feche abas e extensões** visíveis. Se estiver fora do modo anônimo,
  esconda a barra de extensões. Capture só o conteúdo da página.
- **Dados pessoais**: nada de nomes, telefones, e-mails, CPFs ou conversas de
  clientes reais. Troque por dados fictícios ou borre. Na Primor e na YesAgile,
  revise conversas de WhatsApp com cuidado.
- **Zoom do navegador consistente**: use **100%** (Ctrl+0) em todas as
  capturas, com a mesma janela/emulação de tamanho. Isso mantém tipografia e
  espaçamento comparáveis entre os cinco projetos.
- **Mesmo tema** (claro ou escuro) em todos, de preferência o do site.
- **Dados de exemplo plausíveis**: telas com conteúdo, sem "Lorem ipsum",
  campos vazios ou mensagens de erro.
- **Esconda notificações** do Windows (ative "Não perturbe") e feche o que
  aparecer em segundo plano.
- **Cursor**: no GIF, mova o mouse devagar e com propósito; no PNG, deixe fora
  da área.
- Evite capturar a barra de tarefas, o relógio e a barra de endereço.

## 5. Validação automática

Depois de colocar os arquivos em `public/projects/`, rode na raiz do projeto:

```bash
node scripts/valida-capturas.mjs
```

O script (somente leitura) mostra, para cada arquivo, as dimensões reais, a
proporção, o peso e um veredito (`ok`, `proporção errada` ou `ainda é mockup
SVG`). Também lista quais projetos ainda apontam para `.svg`, quais já têm
captura mas o campo `image` não foi atualizado, e a linha `image:` correta para
colar em `src/data/projects.ts`. Ele não altera nenhum arquivo.

## 6. Checklist final

- [ ] Cada um dos cinco projetos tem **um** arquivo em `public/projects/`.
- [ ] Nomes exatos: `primor-moveis`, `arquiteck`, `estagi-on`, `yesagile`, `vitalis` + `.jpg`, `.png` ou `.gif`.
- [ ] Proporção **16:10** em todos (o script mostra `16:10`).
- [ ] JPEG ou PNG com **1600 x 1000** (ou mais, em 16:10); GIF com pelo menos 800 px de largura.
- [ ] JPEG até 500 KB, PNG até 800 KB e GIF até 5 MB.
- [ ] YesAgile e, se possível, Primor em **GIF** mostrando a interação.
- [ ] As telas mostram o sistema **funcionando**, com dados, sem erros nem telas vazias.
- [ ] Sem dados pessoais reais, sem abas, extensões, favoritos ou barra de tarefas à mostra.
- [ ] Mesmo zoom (100%) e mesmo tema em todas as capturas.
- [ ] Campo `image` de cada projeto atualizado em `src/data/projects.ts`.
- [ ] `node scripts/valida-capturas.mjs` sem projetos em `.svg` e sem "proporção errada".
- [ ] Site conferido no navegador (`npm run dev`): imagens nítidas, sem corte ruim, GIF animando.
- [ ] Mockups `.svg` antigos removidos, depois que tudo estiver conferido.
