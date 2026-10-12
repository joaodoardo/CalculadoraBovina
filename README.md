# CalcBov

App mobile (Expo / React Native) para planejar a carga de bovinos em caminhões e carretas:
cadastra o veículo com seus semireboques, andares e gaiolas, e calcula a ocupação de cada
gaiola conforme o peso dos animais.

## Requisitos

- Node.js 20+
- App **Expo Go** (SDK 57) no celular, ou um emulador Android

## Como rodar

```bash
npm install
npm start          # abre o Metro; escaneie o QR code com o Expo Go
```

Outros scripts:

| Script              | O que faz                         |
| ------------------- | --------------------------------- |
| `npm run android`   | Abre direto no emulador Android   |
| `npm run web`       | Roda no navegador                 |
| `npm run lint`      | ESLint (config do Expo)           |
| `npm run typecheck` | Checagem de tipos do TypeScript   |

Build de APK (requer `eas-cli` e login no Expo): `eas build -p android --profile apk`.

## Estrutura

```
src/
├── app/                       # Rotas (expo-router). Apenas compõem telas.
│   ├── _layout.tsx            # Providers globais + Stack
│   ├── index.tsx              # Lista de veículos
│   └── veiculos/[id].tsx      # Detalhe do veículo e suas gaiolas
├── components/ui/             # Componentes genéricos, sem regra de negócio
├── features/
│   └── veiculos/              # Tudo do domínio "veículos"
│       ├── components/        # Componentes da feature (cards, modais, wizard)
│       ├── context/           # Estado global (VeiculosProvider / useVeiculos)
│       ├── hooks/             # Lógica de UI reutilizável (wizard de cadastro)
│       ├── calculos.ts        # Regras de cálculo (área do animal, ocupação)
│       ├── rascunho.ts        # Validação e montagem do veículo no cadastro
│       ├── storage.ts         # Persistência local (AsyncStorage)
│       ├── formatacao.ts      # Textos derivados do domínio
│       ├── constants.ts
│       ├── types.ts
│       └── index.ts           # API pública da feature
├── theme/cores.ts             # Paleta de cores
└── utils/numero.ts            # Conversão/formatação numérica (vírgula decimal)
```

Convenções:

- **Rotas finas**: arquivos em `src/app` não contêm regra de negócio; importam da feature.
- **Imports** com o alias `@/` (aponta para `src/`). Rotas importam features por `@/features/veiculos`.
- **Regras puras** (`calculos.ts`, `rascunho.ts`, `utils/`) não dependem de React e podem ser testadas isoladamente.
- **Cores** vêm de `@/theme/cores`, nunca hexadecimais soltos.
- Nomes de domínio em português (veículo, gaiola, semireboque).

## Regras de cálculo

- Área da gaiola: `comprimento × 2,5 m`.
- Área ocupada por animal: `0,021 × peso^0,67` m², **+7%** se tiver chifres.
- Um animal só entra na gaiola se couber na área restante.
- Cores de ocupação: verde < 70% ≤ laranja < 90% ≤ vermelho.

## Persistência

Os veículos ficam salvos no próprio aparelho via AsyncStorage (`src/features/veiculos/storage.ts`),
na chave `@calcbov/veiculos`, com um número de versão do formato. Ao mudar a estrutura de `Veiculo`,
incremente `VERSAO_ATUAL` e trate a migração em `carregarVeiculos`. Se os dados salvos estiverem
ilegíveis, uma cópia é guardada em `@calcbov/veiculos:backup-<timestamp>` antes de seguir com a lista vazia.
