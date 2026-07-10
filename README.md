# Sistema de Controle de Gastos Residenciais

Este projeto foi desenvolvido como solução para o sistema de controle de gastos residenciais.

---

## Especificação Técnica e Tecnologias

Em conformidade com as diretrizes do projeto, o ecossistema foi dividido em:
*   **Back-end:** Desenvolvido em **.NET 10.0 com C#**, utilizando uma estrutura de API Web robusta, tipagem forte e inversão de dependência.
*   **Front-end:** Desenvolvido em **Typescript com React**, garantindo uma interface rica, componentizada e com verificação de tipos em tempo de desenvolvimento.
*   **Persistência de Dados:** Implementada via **Entity Framework Core** com **SQLite**. Os dados são gravados em arquivo físico e **persistem integralmente mesmo após fechar a aplicação**.

---

## Mapeamento de Funcionalidades e Regras de Negócio

Abaixo está descrita a lógica de funcionamento do sistema:

### 1. Cadastro de Pessoas
*   **Fluxo de Operações (CRUD Relativo):** A aplicação expõe uma interface gráfica conectada a endpoints REST especializados (`POST`, `GET`, `DELETE`). O front-end consome esses serviços para renderizar a tabela de usuários em tempo real e disparar comandos de expurgo de forma segura.
*   **Geração de Chaves Primárias:** O sistema delega a criação do Identificador Único ao provedor do banco de dados utilizando o tipo `Guid` (Globally Unique Identifier). Isso garante imutabilidade e evita colisões de ID sem a necessidade de expor sequências numéricas previsíveis na URL da API.
*   **Estrutura do Modelo de Domínio:** A entidade de dados foi projetada para espelhar estritamente as propriedades core do negócio (`Id`, `Nome`, `Idade`). As validações de campos obrigatórios e limites de caracteres são tratadas na camada de entrada antes do mapeamento para a persistência.
*   **Mecanismo de Deleção em Cascata:** Para garantir a integridade referencial, o relacionamento entre Pessoas e Transações foi configurado via Fluent API no Entity Framework Core com o comportamento `.OnDelete(DeleteBehavior.Cascade)`. Quando o comando de exclusão é enviado ao banco, o SQLite remove o registro do indivíduo e limpa automaticamente todas as chaves estrangeiras vinculadas na tabela de transações em uma única transação atômica.

### 2. Cadastro de Transações
*   **Fluxo Unidirecional de Dados:** Seguindo o escopo do projeto, a aplicação implementa endpoints focados estritamente na persistência (`POST`) e recuperação (`GET`) de registros. A interface gráfica bloqueia ações de alteração de estado posterior (edição ou exclusão), garantindo a imutabilidade do histórico financeiro após o lançamento.
*   **Controle de Chaves Sequenciais:** O identificador exclusivo de cada movimentação é gerenciado via propriedades auto-incrementais no banco de dados (`INTEGER PRIMARY KEY AUTOINCREMENT`). Isso otimiza a indexação das buscas por ordem cronológica de inserção.
*   **Modelagem de Relacionamento (Chave Estrangeira):** A estrutura conecta cada transação a uma propriedade de navegação física no código. No ato do cadastro, o sistema exige a descrição textual da despesa/receita, o valor monetário e um identificador válido que aponte para uma entidade `Pessoa` previamente registrada.
*   **Engine de Validação de Regra de Negócio (Menores de Idade):** Antes de persistir os dados no banco, a camada de aplicação executa uma validação síncrona. O sistema busca a idade da pessoa vinculada e, caso o indivíduo possua menos de 18 anos, intercepta a requisição. Se o tipo da transação for uma 'Receita', a API aborta a operação e retorna um código de erro apropriado para o front-end, blindando o banco de dados contra lançamentos inválidos.
*   **Garantia de Integridade de Dados:** O sistema executa uma checagem de consistência referencial. Caso o front-end envie um ID de usuário inexistente ou corrompido, o back-end rejeita o payload imediatamente através de restrições na camada de banco de dados, impedindo a criação de transações órfãs ou sem vínculos reais.

### 3. Consulta de Totais (Painel Geral)
*   **Agregação e Consolidação de Métricas:** A aplicação processa dinamicamente a relação entre as tabelas de pessoas e movimentações financeiras. Através de consultas estruturadas, o sistema agrupa as transações por usuário e calcula de forma isolada e em tempo real o acumulado de entradas (receitas) e saídas (despesas) de cada indivíduo.
*   **Cálculo de Balanço Individual:** A interface gráfica ou a camada de serviços processa a equação de saldo líquido para cada linha da tabela (Receitas - Despesas). O resultado é renderizado com indicadores visuais que traduzem instantaneamente a saúde financeira individual de cada morador cadastrado.
*   **Cálculo Macro de Balanço Residencial:** No rodapé ou painel de destaque, o sistema executa uma função de redução (*reduce* / agregação global) sobre o conjunto completo de dados na tela. A aplicação soma todas as receitas e despesas da base para gerar o Balanço Consolidado da Residência, fornecendo um indicador de saldo líquido macro que reflete a situação financeira real de todo o ecossistema familiar.

---

## Como Executar a Aplicação

O sistema foi totalmente conteinerizado para garantir que rode de forma idêntica em qualquer ambiente de execução.

### Pré-requisitos
*   **Docker** e **Docker Compose** instalados e em execução.
  
### Execução
Na raiz do projeto (onde encontra-se o arquivo `docker-compose.yml`), execute o comando abaixo no seu terminal:

```bash
docker compose up -d
```

### Aguarde a compilação finalizar. O sistema aplicará as migrações do banco de dados automaticamente e estará disponível em:

  *  Interface Web: http://localhost:8080

  *  Documentação da API (Swagger): http://localhost:5000/swagger

