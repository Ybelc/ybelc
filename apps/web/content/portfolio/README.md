# Portfólio — dados e gerenciamento

A seção de Portfólio (home `/#portfolio` e página `/portfolio`) lê os projetos de **duas fontes**, nesta ordem:

1. **API** — `GET {NEXT_PUBLIC_API_URL}/api/v1/portfolio/projects?status=published&page_size=100`
   (mesmo backend do Blog). Cache de 60 s, tag `portfolio`.
2. **Arquivo local** — `apps/web/content/portfolio/projects.json` (usado quando a API não responde,
   retorna 404/5xx ou não está configurada).

Controle opcional pela variável de servidor `PORTFOLIO_SOURCE`:

| Valor           | Comportamento                                   |
| --------------- | ----------------------------------------------- |
| `auto` (padrão) | API; se indisponível, arquivo local             |
| `api`           | Somente API                                     |
| `local`         | Somente o arquivo local                         |

Somente projetos com `status: "published"` aparecem em produção. Em desenvolvimento (`npm run dev`),
rascunhos do arquivo local também aparecem, marcados como **Rascunho**, para pré-visualização.

## Painel local: `/admin/portfolio`

Disponível **apenas em desenvolvimento** (em produção a página e as rotas `/api/portfolio/admin/*` respondem 404).

- Criar, editar, remover e reordenar projetos.
- Upload de imagens (jpg, png, webp, avif, gif, svg) e vídeos (mp4, webm) — salvos em
  `apps/web/public/portfolio/uploads/`. Também é possível colar URLs externas (CDN, S3 etc.).
- Depois de editar, faça commit de `content/portfolio/projects.json` e `public/portfolio/uploads/`.

Os 5 projetos que vêm no arquivo são **exemplos em rascunho** (mídias em `public/portfolio/exemplos/`).
Substitua-os ou remova-os pelo painel antes de publicar.

## Contrato de dados (API e arquivo)

O schema é validado por `src/lib/portfolio/schema.ts` (zod). A API pode responder `{ "items": [...] }`
ou um array simples. Itens inválidos são ignorados.

```jsonc
{
  "id": "uuid",
  "slug": "central-de-telemetria-iot",        // [a-z0-9-], usado em /#projeto-<slug>
  "title": "Central de Telemetria IoT",
  "tagline": "Frase curta (efeito máquina de escrever)",
  "short_description": "Resumo exibido no painel expandido",
  "full_description": "Texto completo; parágrafos separados por linha em branco",
  "category": "Internet das Coisas",          // usado no filtro da página /portfolio
  "area": "iot",                              // software | automacao | iot | seguranca | null
  "technologies": ["ESP32", "MQTT"],
  "cover_image": { "src": "/portfolio/... ou https://...", "alt": "..." },
  "gallery": [{ "src": "...", "alt": "..." }],
  "video": { "kind": "file", "src": ".../demo.mp4", "poster": ".../poster.jpg" },
  //   ou { "kind": "embed", "url": "https://www.youtube.com/watch?v=..." }  (YouTube, Vimeo ou iframe)
  "project_url": "https://...",
  "demo_url": "https://...",
  "repository_url": "https://github.com/...",
  "year": 2026,
  "is_featured": true,                        // destaques vão para a home (se houver 2 ou mais)
  "display_order": 1,                         // ordem crescente
  "status": "published",                      // draft | published | archived
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601"
}
```

Para gerenciar pelo backend, basta implementar esse endpoint (e o CRUD no painel administrativo existente);
o site passa a usá-lo automaticamente.

## Boas práticas de mídia

- Capa: 1600×1000 (16:10), WebP/JPG até ~400 KB.
- Vídeo de prévia: 5–15 s, H.264/MP4, sem áudio, até ~8 MB. Na vitrine ele só é baixado quando o projeto
  entra em destaque, toca mudo em loop e pausa fora da tela. Com `prefers-reduced-motion`, não toca sozinho.
- Vídeos do YouTube/Vimeo só carregam o player quando o visitante clica (miniatura automática do YouTube).
