# Zénite

**Todas as rotas vêm cá ter.** Protótipo do mercado online da Zénite para São Tomé e Príncipe.

Site estático: só HTML, CSS e JavaScript, sem dependências nem instalação. Funciona no GitHub Pages ou em qualquer alojamento de ficheiros.

## Páginas

| Ficheiro | O que mostra |
|---|---|
| `index.html` | Página inicial: publicidades em destaque, categorias, Tendências do momento, Os mais procurados, carrinho, pesquisa, modo noturno e inglês |
| `produto.html` | Página de produto (Mala de corrente) |
| `telemovel.html` | Página inicial no telemóvel |
| `menu.html` | Menu de categorias (3 riscos), em modo noturno |
| `admin.html` | Administração: painel, produtos, publicar produto, comissões de venda |

## Pastas

```
assets/   fotografias dos produtos A&A e o símbolo do logotipo
js/       zdc.js, o pequeno motor que desenha as páginas
```

## Publicar no GitHub Pages

1. No GitHub, crie um repositório novo (por exemplo `zenite`).
2. Carregue todos os ficheiros desta pasta: **Add file → Upload files**, arraste tudo e carregue em **Commit changes**.
   Ou pela linha de comandos:
   ```bash
   git init
   git add .
   git commit -m "Zénite: primeira versão"
   git branch -M main
   git remote add origin https://github.com/O-SEU-UTILIZADOR/zenite.git
   git push -u origin main
   ```
3. No repositório, abra **Settings → Pages**. Em *Source* escolha **Deploy from a branch**, depois a branch `main` e a pasta `/ (root)`, e carregue em **Save**.
4. Passados uns minutos, o site fica em `https://O-SEU-UTILIZADOR.github.io/zenite/`.

Para ver no computador sem publicar, abra a pasta num terminal e corra `python3 -m http.server`. Depois abra `http://localhost:8000`.

## Antes de usar a sério

- **WhatsApp:** o número `+239 990 0000` é provisório. Procure `2399900000` e `990 0000` nos ficheiros `.html` e troque pelo número verdadeiro.
- **Dados:** é um protótipo. O carrinho, os produtos publicados e as comissões só ficam enquanto a página está aberta, porque não há base de dados nem contas.
- **Marcadores para preencher:** os textos entre parênteses retos, como `[FOTO DO PRODUTO]`, `[CUSTOS POR ZONA]` e `[NOME]`, ainda precisam de conteúdo real.
- **Fotografias:** os produtos de revenda (Samsung, JBL, Philips, …) ainda não têm foto.
