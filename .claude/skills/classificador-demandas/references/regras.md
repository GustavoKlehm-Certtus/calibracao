# Régua de Classificação · Certtus

## Os três pilares

### Pilar 1 — Complexidade (define a classe-base)

| Nível | Nome | Definição | Sinal principal |
|---|---|---|---|
| A1 | Especificado | Solução definida, passo-a-passo existe | Task de HU já planejada; zero decisão de design |
| A2 | Solução em aberto | Problema claro, "como" não especificado | Objetivo e contexto existem; dev propõe e estrutura |
| A3 | Caminho incerto | Objetivo existe, mas caminho não está claro | Concepção exigida; múltiplas abordagens plausíveis; escolha com avaliação de risco |
| A4 | Sem definição prévia | Não há definição nem padrão a seguir | Dev define a própria arquitetura; cria ou muda padrões técnicos |
| A5 | Define princípios | Impacto em múltiplos produtos, equipes e longo prazo | Decisão que vira referência para a empresa inteira |

**Sinal de A1 vs A2:** A1 tem o "como" descrito; A2 só tem o "o quê".
**Sinal de A2 vs A3:** A2 tem caminho conhecido (replicar padrão); A3 exige escolher entre caminhos, cada um com consequências diferentes.
**Sinal de A3 vs A4:** A3 tem objetivo claro mas caminho incerto; A4 não tem nem o caminho nem definição do que arquitetar.
**Sinal de A4 vs A5:** A4 impacta um produto; A5 impacta múltiplos produtos e o longo prazo da empresa.

---

### Pilar 2 — Escopo (modificador)

| Nível | Abrangência |
|---|---|
| 1 | Uma rotina / ponto isolado |
| 2 | Uma funcionalidade / um módulo |
| 3 | Múltiplos módulos com dependências entre si |
| 4 | O produto inteiro / sua sustentabilidade |
| 5 | Múltiplos produtos / a empresa |

---

### Pilar 3 — Risco (flag binária)

**Risco = S** quando qualquer uma das condições abaixo for verdadeira:

- **Regulatório:** envolve regra fiscal, tributária ou legal (NF-e, SEFAZ, Reforma Tributária, Simples Nacional, CFOP, IBS/CBS)
- **Irreversível:** migração de dados, mudança de schema, operação que não tem desfazer fácil
- **Dados sensíveis / segurança:** autenticação, permissões, dados financeiros de clientes
- **Produção crítica:** se der errado, para o cliente ou afeta todos os clientes simultaneamente

**Risco = N** nos demais casos, incluindo:
- Funcionalidade nova sem impacto em dados existentes
- Interface / UX / relatórios de consulta
- Operações de implantação (acontecem uma vez, fáceis de reverter)

---

### Regra de combinação

```
Classe-base = número do nível de Complexidade (A1=1, A2=2 ... A5=5)

Se (Escopo ≥ 3) OU (Risco = S):
    Classe = Classe-base + 1
Senão:
    Classe = Classe-base

Classe máxima = 5
```

**Importante:** o modificador é +1 máximo, não cumulativo. Escopo ≥ 3 E Risco = S juntos ainda somam +1, não +2.

**Tabela rápida:**

| Complexidade | Escopo < 3 e Risco N | Escopo ≥ 3 ou Risco S |
|---|---|---|
| A1 | C1 · Junior | C2 · Pleno |
| A2 | C2 · Pleno | C3 · Sênior |
| A3 | C3 · Sênior | C4 · Especialista |
| A4 | C4 · Especialista | C5 · Master |
| A5 | C5 · Master | C5 · Master |

---

## Conceito de unidade de posse

Uma demanda não tem uma classe única. Ela contém unidades de classes diferentes:

| Unidade | Classe típica |
|---|---|
| Task (executar pedaço já especificado) | C1 · Junior |
| HU (estruturar solução de um pedaço) | C2 · Pleno |
| Concepção da demanda inteira | C3 · Sênior |
| Arquitetura / padrões que atravessam a demanda | C4–C5 · Especialista/Master |

**Classificamos sempre a unidade de maior classe dentro da demanda** — geralmente a Concepção do Epic.

---

## Casos especiais

### "Replicar padrão existente"
Se o padrão técnico já existe no sistema (ex.: dashboard com 3 precedentes, integração bancária com modelo do Banco do Brasil), a Complexidade cai — o dev não precisa inventar, só aplicar. Verificar no GitHub antes de classificar.

### "Estudar" no sumário ou descrição vaga
Sinal forte de A3–A4. Se nem a equipe sabe o caminho, o dev vai ter que descobrir.

### Documentação muito detalhada com critérios de aceite
Puxa em direção a A1–A2, mesmo que o tema seja complexo. A complexidade do tema não é a mesma coisa que a ambiguidade do caminho técnico.

### PRG → Formulário no VFP
Adiciona esforço considerável mas não eleva automaticamente a Complexidade. Avaliar se há decisão de design envolvida além da migração estrutural.

### Reforma Tributária
Quase sempre Risco = S (regulatório). Raramente abaixo de C3. Para funcionalidades novas sem padrão no sistema, tende a A4/C5.

### Demandas de e-commerce / integradores
Verificar se o padrão já existe para outro integrador (ex.: Tray → Bring). Se sim, Complexidade cai para A2. Se é o primeiro integrador do tipo, pode ser A3–A4.

### Primeiros módulos de um produto novo (ex.: primeiro módulo do BI)
Mesmo que a funcionalidade seja simples, a ausência de padrão anterior eleva a Complexidade para A3 — o dev precisa definir a estrutura que os próximos vão seguir.

---

## O que NÃO eleva a classe

- **Escopo mecânico largo mas previsível:** muitas rotinas repetitivas sem decisão de design (ex.: CNPJ alfanumérico — tocou muitas rotinas mas o padrão era óbvio)
- **Tema complexo com especificação detalhada:** reforma tributária com todos os critérios de aceite descritos pode ser C2 se o "como" está claro
- **Esforço grande:** trabalhoso ≠ complexo. Esforço é função do tamanho; complexidade é função do julgamento exigido
- **Risco de regressão baixo:** verificar algo que já funciona pode dar errado, mas se o impacto é isolado e reversível, não é Risco = S
