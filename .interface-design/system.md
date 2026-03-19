# Interface Design System — Tattoo & Piercing Studio

## Intent
Software para donos e tatuadores de estúdio. Estão no balcão entre clientes, em um ambiente escuro com arte nas paredes, música tocando. O app deve parecer que pertence a esse mundo — não um SaaS genérico com logo de tattoo.

**Feel:** Precisão artesanal. Dark como o estúdio à noite. Âmbar quente como a lâmpada sobre a poltrona.

---

## Palette

| Token | Valor | Uso |
|-------|-------|-----|
| `--ink` | `#131313` | Superfície principal, sidebar, botão primary |
| `--ink-deep` | `#0a0908` | Active/pressed dark |
| `--ink-raised` | `#222020` | Hover dark |
| `--amber` | `#e6b966` | **Único acento** — foco, ativo, CTA |
| `--amber-dim` | `#c9923a` | Hover âmbar |
| `--amber-dark` | `#b8832e` | Active âmbar |
| `--amber-pale` | `rgba(230,185,102,0.12)` | Fundo âmbar sutil |
| `--amber-glow` | `rgba(230,185,102,0.22)` | Ring de foco |
| `--parchment-muted` | `#f0ebe3` | Body background (warm, não cinza) |
| `--parchment` | `#f7f4f0` | Surface leve, alt. background |
| `--parchment-raised` | `#ffffff` | Cards, modais, inputs |
| `--surface-auth` | `#0f0d0c` | Fundo das telas de auth |
| `--surface-auth-raised` | `#1a1714` | Card nas telas de auth |

## Text Hierarchy
```
--text-primary     #1a1614    Texto principal
--text-secondary   #4a4540    Texto suporte
--text-tertiary    #8c8680    Metadata, labels
--text-muted       #b5b0aa    Disabled, placeholder
--text-inverse     #f5f0e8    Texto sobre superfícies dark
--text-inverse-dim rgba(245,240,232,0.55)
--text-inverse-muted rgba(245,240,232,0.32)
```

## Borders
```
--border         rgba(26,22,18,0.09)   Separação padrão (warm)
--border-strong  rgba(26,22,18,0.16)   Ênfase
--border-inverse rgba(255,255,255,0.1)  Sobre dark
--border-inverse-strong rgba(255,255,255,0.18)
```

---

## Depth Strategy
- **App interno (conteúdo):** borders-only. Sem sombra nos cards. Separação por `--border`.
- **Auth screens:** sombra única no card (`0 32px 64px rgba(0,0,0,0.5)`).
- **Modais:** `0 20px 40px rgba(0,0,0,0.18)` + border.
- Regra: **nunca misturar** sombra e border no mesmo nível.

---

## Typography
- **Fonte:** Montserrat (weights: 400, 500, 600, 700, 800)
- Botões: `font-weight: 600`, `letter-spacing: 0.02em`, **sem uppercase**
- Títulos de modal: uppercase com `letter-spacing: 0.06em`
- Section labels na sidebar: 10px, 700, `letter-spacing: 0.1em`, uppercase

---

## Spacing
- Base: `--spacing: 4px`
- Componentes: 8px, 12px, 16px, 20px, 24px
- Página: `--page-padding: 24px`

---

## Border Radius
```
--radius-sm:           4px
--input-border-radius: 6px   ← inputs, buttons
--border-radius:       8px   ← cards
--radius-lg:           14px  ← modais, auth cards
--shape-border-radius: 16px  ← elementos de destaque
```

---

## Signature: O traço âmbar
Todo estado de foco usa `border-color: var(--amber)` + `box-shadow: 0 0 0 3px var(--amber-glow)`. Todo item de menu ativo usa `background: var(--amber)`, `color: var(--ink)`. Único acento no sistema inteiro.

---

## Component Patterns

### Input (dark context)
Para usar inputs em contexto dark (auth screens), defina no container pai:
```scss
--input-surface: rgba(255, 255, 255, 0.05);
--input-border-color: rgba(255, 255, 255, 0.12);
--input-text-color: var(--text-inverse);
--input-label-color: var(--text-inverse-dim);
--input-placeholder-color: rgba(245, 240, 232, 0.2);
--input-icon-color: var(--text-inverse-dim);
```

### Stepper (dark context)
```scss
--stepper-line: rgba(255, 255, 255, 0.12);
--stepper-border: rgba(255, 255, 255, 0.18);
--stepper-text: rgba(255, 255, 255, 0.3);
```

### Button variants
- `primary`: ink fill → text inverse
- `secondary`: amber fill → ink text
- `tertiary`: ghost → warm gray hover

### GoogleButton
- `variant="dark"` (default): para auth screens
- `variant="light"`: para uso no app claro

### Auth screens
Estrutura padrão:
```
container (--surface-auth + radial amber glow sutil)
  └── card (--surface-auth-raised + border-inverse + shadow)
        &::before → traço âmbar 2px no topo
```

---

## What NOT to do
- Nunca usar azul como cor de ação (`#3b82f6`, `#e3f2fd`, `#bbdefb` foram removidos)
- Nunca usar `text-transform: uppercase` em botões normais
- Nunca usar fundo cinza frio (`#f0f0f0`) — usar `--parchment-muted`
- Nunca usar `color: hardcoded-hex` — sempre CSS custom properties
