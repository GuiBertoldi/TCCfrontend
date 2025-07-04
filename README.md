
# **README - Frontend do Sistema de Gerenciamento de Prontuários Psicológicos e Agendamento de Consultas**

## 1. **Introdução**

### 1.1. **Contexto**
Este repositório contém o **frontend** do **Sistema de Gerenciamento de Prontuários Psicológicos e Agendamento de Consultas**, desenvolvido em **React**. O sistema é projetado para automatizar e digitalizar os processos administrativos de pequenos consultórios de psicologia, como a criação e gestão de prontuários de pacientes e agendamento de consultas.

### 1.2. **Justificativa**
A proposta é otimizar o trabalho dos psicólogos em pequenos consultórios, permitindo que o foco esteja no atendimento clínico, e não em tarefas administrativas. A automação e a organização dos dados ajudam a melhorar o atendimento ao paciente, aumentando a produtividade e a qualidade do serviço.

### 1.3. **Objetivo**
O objetivo deste projeto é fornecer uma aplicação web intuitiva para psicólogos, permitindo:
- A criação e visualização de prontuários de pacientes.
- O gerenciamento de agendamentos.
- A configuração de horários de atendimento dos psicólogos.

---

## 2. **Tecnologias Utilizadas**

- **React**: Biblioteca JavaScript para a construção da interface do usuário.
- **React Router**: Para navegação entre as páginas da aplicação.
- **Axios**: Para realizar chamadas à API backend (RESTful).
- **Material-UI**: Para a construção de componentes de interface com o usuário.
- **Jest**: Framework de testes unitários.

---

## 3. **Montagem do Ambiente Local**

### 3.1. **Pré-requisitos**

Antes de rodar o projeto localmente, você precisa instalar as seguintes ferramentas:

- **Node.js** (versão recomendada: v16.x ou superior)
- **Git** (para clonar o repositório)
- **NPM ou Yarn** (para gerenciar pacotes)

### 3.2. **Clonando o Repositório**

Clone o repositório para o seu ambiente local:

```bash
git clone https://github.com/GuiBertoldi/TCCfrontend.git
cd TCCfrontend
```

### 3.3. **Instalação das Dependências**

Instale as dependências necessárias para rodar o frontend:

```bash
npm install
```

### 3.4. **Rodando a Aplicação Localmente**

Inicie o servidor de desenvolvimento:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

---

## 4. **CI/CD com GitHub Actions**

Este repositório utiliza **GitHub Actions** para automação de **build**, **testes**, **análise de código com SonarCloud** e **deploy na AWS Amplify**. O fluxo de trabalho é acionado sempre que há um **commit**.

### 4.1. **Fluxo de Trabalho do GitHub Actions**

1. **Commit e Push**:
   - O desenvolvedor faz um commit e push para o repositório.

2. **Build e Testes**:
   - O GitHub Actions inicia o processo de **build** do código.
   - O **frontend** é testado utilizando **Jest** para garantir que não há erros no código.

3. **Análise com SonarCloud**:
   - Após os testes, o GitHub Actions envia os dados de cobertura de testes para o **SonarCloud**.
   - O **SonarCloud** realiza uma análise estática do código, verificando qualidade, segurança e possíveis vulnerabilidades.

4. **Deploy na AWS Amplify**:
   - Se todos os testes passarem e o código for aprovado na análise do SonarCloud, o **GitHub Actions** faz o **deploy** automático na **AWS Amplify**.
   - O deploy garante que o **frontend React** seja atualizado de maneira contínua, refletindo as últimas mudanças no ambiente de produção.

5. **Monitoramento com Grafana**:
   - Após o deploy, os dados de uso e desempenho da aplicação são coletados e integrados ao **Grafana** junto a aws, para visualização e monitoramento em tempo real.

---

## 5. **Considerações de Segurança**

**Armazenamento Seguro de Dados**
- Utilizar **HTTPS** para comunicação entre o frontend e o backend.
- Certificar-se de que **dados sensíveis** (como informações de login) sejam protegidos adequadamente.

