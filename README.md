# Ponto Eletrônico

Aplicação de controle de ponto eletrônico pessoal, construída com **React + Vite**.

> Registre entrada, saída do almoço, retorno do almoço e saída — e acompanhe o balanço de horas do mês em tempo real.

---

## 📌 Funcionalidades

- Registro dos 4 batimentos diários (entrada · saída almoço · retorno almoço · saída)
- Cálculo automático de horas trabalhadas e saldo do dia
- Meta mensal calculada por **dias úteis reais** (exclui finais de semana e feriados nacionais)
- Feriados nacionais brasileiros fixos + móveis (Carnaval, Sexta Santa, Páscoa, Corpus Christi) calculados dinamicamente por ano
- Balanço mensal: horas feitas × meta, dias restantes e progresso percentual
- Histórico mensal com saldo por dia
- Dados persistidos em `localStorage` — funciona offline, sem backend
- Navegação entre meses
- Layout responsivo (mobile-first)

---

## 💻 Stack / Tecnologias Utilizadas

| Framework | React 18 |
| Build tool | Vite 5 |
| Estilo | CSS Modules + variáveis CSS |
| Persistência | localStorage |

---

## 📂 Arquitetura

```
src/
├── components/         # Componentes de UI isolados
│   ├── MetricCard      # Card de métrica (meta, horas, saldo)
│   ├── ProgressBar     # Barra de progresso mensal
│   ├── PunchForm       # Formulário de registro diário
│   └── HistoryList     # Histórico mensal
├── hooks/
│   ├── usePonto.js     # Lógica de negócio principal (métricas, CRUD)
│   └── useLocalStorage.js  # Persistência genérica
├── utils/
│   └── dateTime.js     # Feriados, dias úteis, aritmética de tempo
├── styles/
│   └── global.css      # Design tokens e reset
├── App.jsx             # Composição principal + navegação de abas
└── main.jsx            # Entry point
```

**Decisões de arquitetura:**
- A lógica de negócio fica exclusivamente em `hooks/` e `utils/` — os componentes só renderizam
- `usePonto` é o único ponto de verdade para o estado mensal
- Cada componente tem seu próprio CSS Module — zero conflito de classes, fácil de manter
- Os feriados móveis são calculados em runtime (algoritmo Meeus/Jones/Butcher), sem tabela hard-coded

---

## 🎮 Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/nevezluan/ponto-eletronico.git
cd ponto-eletronico

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Abra http://localhost:5173
```

---

## 🚀 Deploy na Vercel

O app está publicado em: https://ponto-eletronico-nine.vercel.app/

Para publicar o seu próprio:
1. Suba o projeto no GitHub
2. Acesse [vercel.com] e conecte o repositório
3. Clique em **Deploy** — a Vercel detecta o Vite automaticamente 

Todo `git push` na branch `main` dispara um novo deploy.

---

## 🌎 Roadmap

- [ ] Jornada diária configurável pelo usuário (atual: fixo em 8h/dia)
- [ ] PWA (manifest + service worker → instalável no celular)
- [ ] Exportar relatório mensal em PDF
- [ ] Migrar persistência para Supabase (dados na nuvem, multi-dispositivo)
- [ ] Autenticação (para uso em equipe)
- [ ] Gráfico de horas semanais

---
