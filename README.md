# 🌐 PAM_PartnerWeb

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-13.0-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-0081CB?style=for-the-badge&logo=material-ui)](https://mui.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

**Aplicação web moderna e responsiva para a Plataforma PAM**

[🚀 Demo](#demo) • [📖 Documentação](#documentacao) • [🛠️ Instalação](#instalacao) • [🤝 Contribuição](#contribuicao)

</div>

---

## 📋 Sobre o Projeto

**Portal web dedicado aos parceiros/prestadores** de serviço da plataforma PAM. Interface especializada para gerenciamento de perfil profissional, visualização de pedidos, agenda de serviços, histórico financeiro, comunicação com clientes, upload de documentos e métricas de performance.

### 🎯 Principais Funcionalidades

- 👤 **Perfil Profissional**: Gestão completa de dados e certificações
- 📅 **Agenda**: Calendário inteligente de agendamentos
- 📋 **Pedidos**: Visualização e gestão de solicitações
- 💰 **Financeiro**: Comissões, pagamentos e relatórios
- 💬 **Comunicação**: Chat direto com clientes
- 📄 **Documentos**: Upload e gestão de certificados
- 📊 **Performance**: Métricas e avaliações
- 🎯 **Especialidades**: Gestão de áreas de atuação
- 📱 **Mobile-First**: Otimizado para dispositivos móveis
- 🔔 **Notificações**: Alertas de novos pedidos e mensagens

## 🚀 Tecnologias

### Frontend Framework
- **[Next.js 13](https://nextjs.org/)** - Framework React com SSR/SSG
- **[React 18](https://reactjs.org/)** - Biblioteca de interface
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática

### UI/UX
- **[Material-UI (MUI)](https://mui.com/)** - Biblioteca de componentes
- **[Emotion](https://emotion.sh/)** - CSS-in-JS
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários

## 📦 Pré-requisitos

- **[Node.js 18+](https://nodejs.org/)** (versão LTS recomendada)
- **[Yarn](https://yarnpkg.com/)** ou **[npm](https://www.npmjs.com/)** (gerenciador de pacotes)
- **[Git](https://git-scm.com/)** (controle de versão)

## 🛠️ Instalação

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/EmmanuelSMenezes/PAM_PartnerWeb.git
cd PAM_PartnerWeb
```

### 2️⃣ Instalar Dependências

```bash
# Usando Yarn (recomendado)
yarn install

# Ou usando npm
npm install
```

### 3️⃣ Configuração do Ambiente

```bash
cp .env.example .env.local
```

### 4️⃣ Executar em Desenvolvimento

```bash
yarn dev
# ou
npm run dev
```

### 5️⃣ Verificar Instalação

Acesse `http://localhost:8027` para ver a aplicação rodando.

## 🐳 Docker

```bash
# Build
docker build -t pam_partnerweb .

# Run
docker run -p 8027:8027 pam_partnerweb
```

## 🧪 Testes

```bash
yarn test
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **📧 Email**: suporte@pam.com
- **🐛 Issues**: [GitHub Issues](https://github.com/EmmanuelSMenezes/PAM_PartnerWeb/issues)

---

<div align="center">

**PAM - Plataforma de Agendamento de Manutenção**
*Desenvolvido com ❤️ pela equipe PAM*

</div>
