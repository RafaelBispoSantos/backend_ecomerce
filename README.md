<div align="center">
  <br />
  <a href=https://res.cloudinary.com/dmhyzqdp9/image/upload/v1742073923/screenshot-for-readme_ojudqh.png" target="_blank">
    <img src="https://res.cloudinary.com/dmhyzqdp9/image/upload/v1742073923/screenshot-for-readme_ojudqh.png" alt="Project Banner" />
  </a>
  <br />

<div>
    <img src="https://img.shields.io/badge/-React-000000?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/-Vite-000000?style=for-the-badge&logo=vite&logoColor=646CFF" alt="Vite" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-000000?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/-Node.js-000000?style=for-the-badge&logo=node.js&logoColor=339933" alt="Node.js" />
    <img src="https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=FFFFFF" alt="Express" />
    <img src="https://img.shields.io/badge/-MongoDB-000000?style=for-the-badge&logo=mongodb&logoColor=47A248" alt="MongoDB" />
    <img src="https://img.shields.io/badge/-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/-Stripe-000000?style=for-the-badge&logo=stripe&logoColor=008CDD" alt="Stripe" />
  </div>

  <h3 align="center">Ecommerce Story - Plataforma de E-commerce </h3>
</div>

---

## 🎓 O que aprendi neste projeto

### Desenvolvimento Backend Robusto
- **Autenticação e Autorização:** Implementação de autenticação segura com JWT e gerenciamento de permissões de usuário.
- **Gerenciamento de Produtos:** CRUD completo para produtos, incluindo upload de imagens com Cloudinary.
- **Processamento de Pagamentos:** Integração com a API do Stripe para transações seguras.
- **Gerenciamento de Pedidos:** Fluxo completo de pedidos, desde a criação até o acompanhamento do status.
- **Caching e Sessões com Redis:** Utilização do Redis (via ioredis) para caching estratégico, gerenciamento de sessões e análise em tempo real, melhorando a performance da aplicação.

### Desenvolvimento Frontend Moderno
- **Configuração de Ambiente:** Utilização do Vite para um ambiente de desenvolvimento rápido e eficiente.
- **Componentização com React:** Criação de componentes reutilizáveis para uma interface de usuário dinâmica.
- **Estilização com Tailwind CSS:** Aplicação de classes utilitárias para um design responsivo e moderno.
- **Gerenciamento de Estado:** Utilização de bibliotecas como Zustand para gerenciamento eficiente do estado global.

### Integrações e Funcionalidades Avançadas
- **Upload de Arquivos:** Gerenciamento de uploads de imagens e outros arquivos com Multer.
- **Animações e Interatividade:** Melhoria da experiência do usuário com animações utilizando Framer Motion.
- **Notificações:** Feedback instantâneo ao usuário com React Hot Toast.

---


## 🛠️ Principais Tecnologias Utilizadas

| Categoria           | Tecnologias                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **Frontend**        | React 19, Vite 6, Tailwind CSS 4, React Router 7                            |
| **Backend**         | Node.js, Express.js, Mongoose, JWT                                          |
| **Banco de Dados**  | MongoDB                                                                     |
| **Cache & Sessões** | Redis (ioredis)                                                             |
| **Integrações**     | Stripe, Cloudinary, Multer, Framer Motion, React Confetti, React Hot Toast    |
| **Gerenciamento**   | Zustand                                                                     |

---

## ✨ Funcionalidades Implementadas

### Sistema Principal
- **Autenticação Segura:** Login e registro com validação JWT e gerenciamento de sessões.
- **Catálogo de Produtos:** Listagem dinâmica, detalhamento de produtos e imagens.
- **Carrinho de Compras:** Adição, remoção e atualização de itens no carrinho.
- **Checkout Integrado:** Processamento de pagamentos seguro via Stripe.
- **Painel Administrativo:** Gerenciamento de produtos, pedidos e controle de usuários.

### Funcionalidades Avançadas
- **Animações e Transições:** Experiência de usuário aprimorada com Framer Motion.
- **Caching Estratégico com Redis:** Redução de latência e aumento da performance com armazenamento em memória.
- **Notificações:** Feedback instantâneo ao usuário com React Hot Toast.
- **Upload de Imagens:** Upload e gerenciamento de imagens de produtos com Cloudinary.
- **Upload de Mídia:** Suporte a upload de imagens e vídeos para produtos usando Multer.
- **Dashboard Analítico:** Visualização de métricas e gráficos com Recharts.
- **Gerenciamento de Estado:** Uso de Zustand para sincronização de dados em tempo real.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js:** Certifique-se de ter o Node.js instalado na versão mais recente.
- **Gerenciador de Pacotes:** Utilize npm ou yarn conforme sua preferência.
- **MongoDB:** Tenha uma instância do MongoDB em execução.
- **Redis:** Garanta que o Redis esteja acessível (localmente ou via serviço).

### Clonando o Repositório

```bash
git clone https://github.com/RafaelBispoSantos/ecommerce-story.git
cd ecommerce-story
```
### Instalação
O projeto está organizado em duas pastas: backend e frontend. Instale as dependências em cada uma delas.

Backend
Navegue até a pasta backend e instale as dependências:

```bash
cd backend
npm install
```
Frontend
Navegue até a pasta frontend e instale as dependências:
```bash
cd ../frontend
npm install
```

### Configuração de Variáveis de Ambiente
Crie um arquivo .env na raiz de cada pasta e adicione as variáveis necessárias.

Exemplo para o Backend:
```bash
PORT=4000
MONGO_URI=sua_string_de_conexão_mongodb
JWT_SECRET=sua_chave_secreta_jwt
STRIPE_API_KEY=sua_chave_api_stripe
CLOUDINARY_NAME=seu_nome_cloudinary
CLOUDINARY_API_KEY=sua_chave_api_cloudinary
CLOUDINARY_API_SECRET=sua_chave_secreta_cloudinary
REDIS_URI=sua_string_de_conexão_redis
```
Abra http://localhost:3000 no navegador para visualizar a aplicação.

## 📚 Recursos e Documentação

- **[Documentação do React](https://reactjs.org/docs/getting-started.html)**  
  Guia oficial para começar com React, incluindo conceitos fundamentais e tutoriais.

- **[Guia do Vite](https://vitejs.dev/guide/)**  
  Documentação do Vite, uma ferramenta de build rápida para projetos web modernos.

- **[Tailwind CSS Docs](https://tailwindcss.com/docs)**  
  Referência completa para utilizar as classes utilitárias do Tailwind CSS.

- **[Express.js Documentation](https://expressjs.com/)**  
  Guia oficial do Express.js, um framework web para Node.js.

- **[Mongoose Documentation](https://mongoosejs.com/docs/)**  
  Documentação do Mongoose, uma biblioteca de modelagem de dados para MongoDB e Node.js.

- **[Stripe API Reference](https://stripe.com/docs/api)**  
  Referência da API do Stripe para integração de pagamentos.

- **[Cloudinary Documentation](https://cloudinary.com/documentation)**  
  Guia para utilizar os serviços de gerenciamento de mídia do Cloudinary.

- **[Multer Documentation](https://github.com/expressjs/multer)**  
  Documentação do Multer, um middleware para manipulação de multipart/form-data em Node.js.

- **[ioredis Documentation](https://github.com/luin/ioredis)**  
  Guia para utilizar o ioredis, um cliente Redis para Node.js.

- **[Framer Motion Docs](https://www.framer.com/motion/)**  
  Documentação do Framer Motion, uma biblioteca de animações para React.

- **[Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)**  
  Guia para começar com Zustand, uma biblioteca de gerenciamento de estado para React.

- **[React Router Docs](https://reactrouter.com/en/main)**  
  Documentação do React Router para navegação em aplicações React.

## 📢 Contribuições

Se você deseja contribuir para o projeto:

- Abra uma [issue](https://github.com/RafaelBispoSantos/ecommerce-story/issues) para relatar problemas ou sugerir melhorias.
- Envie um pull request com suas alterações.

---

© 2025 Ecommerce Story


