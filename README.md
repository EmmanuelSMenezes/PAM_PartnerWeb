# PAM_PartnerWeb

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-13.0-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-0081CB?style=for-the-badge&logo=material-ui)](https://mui.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

**Aplicacao web moderna e responsiva para a Plataforma PAM**

[Demo](#demo) â€¢ [Documentacao](#documentacao) â€¢ [Instalacao](#instalacao) â€¢ [Contribuicao](#contribuicao)

</div>

---

## Sobre o Projeto

Portal web dedicado aos parceiros/prestadores de servico da plataforma PAM. Interface especializada para gerenciamento de perfil profissional, visualizacao de pedidos, agenda de servicos, historico financeiro, comunicacao com clientes, upload de documentos e metricas de performance.

### Principais Funcionalidades

- **Perfil Profissional**: Gestao completa de dados e certificacoes
- **Agenda**: Calendario inteligente de agendamentos
- **Pedidos**: Visualizacao e gestao de solicitacoes
- **Financeiro**: Comissoes, pagamentos e relatorios
- **Comunicacao**: Chat direto com clientes
- **Documentos**: Upload e gestao de certificados
- **Performance**: Metricas e avaliacoes
- **Especialidades**: Gestao de areas de atuacao
- **Mobile-First**: Otimizado para dispositivos moveis
- **Notificacoes**: Alertas de novos pedidos e mensagens

## Tecnologias

### Frontend Framework
- **[Next.js 13](https://nextjs.org/)** - Framework React com SSR/SSG
- **[React 18](https://reactjs.org/)** - Biblioteca de interface
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estatica

### UI/UX
- **[Material-UI (MUI)](https://mui.com/)** - Biblioteca de componentes
- **[Emotion](https://emotion.sh/)** - CSS-in-JS
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formularios

## Pre-requisitos

- **[Node.js 18+](https://nodejs.org/)** (versao LTS recomendada)
- **[Yarn](https://yarnpkg.com/)** ou **[npm](https://www.npmjs.com/)** (gerenciador de pacotes)
- **[Git](https://git-scm.com/)** (controle de versao)

## Instalacao

### 1. Clone o Repositorio

`ash
git clone https://github.com/EmmanuelSMenezes/PAM_PartnerWeb.git
cd PAM_PartnerWeb
`

### 2. Instalar Dependencias

`ash
# Usando Yarn (recomendado)
yarn install

# Ou usando npm
npm install
`

### 3. Configuracao do Ambiente

`ash
cp .env.example .env.local
`

### 4. Executar em Desenvolvimento

`ash
yarn dev
# ou
npm run dev
`

### 5. Verificar Instalacao

Acesse http://localhost:8027 para ver a aplicacao rodando.

## Docker

`ash
# Build
docker build -t pam_partnerweb .

# Run
docker run -p 8027:8027 pam_partnerweb
`

## Build de Producao

`ash
yarn build
yarn start
`

## Testes

`ash
yarn test
`

## Contribuicao

1. Fork o projeto
2. Crie uma branch (git checkout -b feature/nova-funcionalidade)
3. Commit suas mudancas (git commit -m 'feat: nova funcionalidade')
4. Push para a branch (git push origin feature/nova-funcionalidade)
5. Abra um Pull Request

## Licenca

Este projeto esta sob a licenca **MIT**. Veja [LICENSE](LICENSE) para mais detalhes.

## Suporte

- **Email**: suporte@pam.com
- **Issues**: [GitHub Issues](https://github.com/EmmanuelSMenezes/PAM_PartnerWeb/issues)

---

<div align="center">

**PAM - Plataforma de Agendamento de Manutencao**  
*Desenvolvido com amor pela equipe PAM*

</div>