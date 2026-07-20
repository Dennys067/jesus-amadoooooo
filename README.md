<<<<<<< HEAD
# 🏟️ Arena Prime - Sistema de Reserva e Gestão de Quadras de Areia

Bem-vindo ao **Arena Prime**, uma aplicação full-stack de alta performance projetada para simplificar a reserva de quadras esportivas (Beach Tennis, Vôlei de Praia e Futvôlei) e automatizar o controle gerencial completo do estabelecimento. 

Este projeto foi reestruturado para ser **totalmente portátil e autônomo**. Ele pode ser clonado, editado e hospedado diretamente no seu GitHub, rodando localmente de forma simples sem qualquer dependência obrigatória do Firebase para desenvolvimento ou funcionamento do sistema principal.

---

## 🚀 Funcionalidades Principais

- 📅 **Grade de Agendamentos Dinâmica**: Visualização diária e semanal de horários com reserva instantânea.
- 🛡️ **Painel Administrativo Completo**: Acesso rápido (senha padrão: `admin123`) para controle total:
  - Criação de reservas e bloqueio manual de horários (manutenção, eventos, clínicas).
  - Gerenciamento dinâmico de valores de locação por hora para cada quadra.
  - Cardápio Digital (CRUD completo de porções, pratos, lanches e bebidas com tags).
  - Gerenciamento de Torneios de Areia (divulgação, status de inscrições, categorias).
  - Gerenciamento da Galeria de Fotos e imagens de banner do site.
- 📊 **Métricas Financeiras**: Relatório integrado de faturamento estimado e estatísticas de reservas em tempo real.
- 🔌 **Integrações de API do Google (Opcional)**:
  - **Google Forms**: Sincronização direta de respostas e questionários de satisfação.
  - **Google Drive**: Repositório centralizado para armazenamento de regulamentos e backups gerenciais.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion (para transições fluidas).
- **Backend**: Node.js, Express, TypeScript, Esbuild (empacotamento de produção super veloz).
- **Banco de Dados**: PostgreSQL com Drizzle ORM (migrações rápidas e consultas fortemente tipadas).

---

## 📋 Pré-requisitos

Certifique-se de ter os seguintes softwares instalados no seu computador:

- **Node.js** (v22 ou superior recomendada)
- **NPM** (incluído no Node.js)
- **PostgreSQL** (banco de dados relacional rodando localmente ou na nuvem)

---

## 🔧 Instalação e Configuração Local

Siga os passos abaixo para configurar o projeto na sua máquina local:

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/arena-prime.git
cd arena-prime
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Duplique o arquivo `.env.example` e renomeie-o para `.env`:
```bash
cp .env.example .env
```

Abra o arquivo `.env` e configure suas credenciais do **Supabase**:
```env
# Banco de Dados Supabase (PostgreSQL com SSL)
SQL_HOST="aws-0-us-east-1.pooler.supabase.com" # Host do seu banco no Supabase
SQL_PORT="5432"                                 # Porta
SQL_USER="postgres.your-project-id"            # Usuário do banco
SQL_PASSWORD="your-db-password"                 # Senha do banco
SQL_DB_NAME="postgres"                          # Nome do banco (padrão do Supabase)

# Drizzle Kit Admin Config (mesmos dados acima, usado para empurrar o schema)
SQL_ADMIN_USER="postgres.your-project-id"
SQL_ADMIN_PASSWORD="your-db-password"
SQL_SSL="true"

# Supabase Storage & Auth Client Config (Upload de imagens e login administrativo)
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

### 4. Configurar os Recursos no Supabase

Para que o projeto funcione perfeitamente com todas as funcionalidades de banco de dados, upload de imagens e gerenciamento, siga estes passos simples no painel do [Supabase](https://supabase.com/):

#### A. Banco de Dados (PostgreSQL)
A estrutura de tabelas é gerenciada de forma declarativa e automática via **Drizzle ORM**. Você não precisa criar as tabelas manualmente! Basta rodar o comando abaixo para criar todas as tabelas no Supabase:
```bash
npm run db:push
```
Isso criará de forma instantânea as tabelas de `courts` (quadras), `bookings` (agendamentos), `menu_items` (cardápio), `tournaments` (torneios), `gallery_items` (galeria) e `site_settings` (configurações do site).

#### B. Armazenamento (Supabase Storage)
Para permitir o upload direto de fotos de quadras, capas de torneios, itens do cardápio e logos:
1. Vá até a seção **Storage** no menu lateral esquerdo do painel do Supabase.
2. Clique em **New Bucket** (Novo Bucket).
3. Defina o nome exatamente como: `arena-prime`.
4. Marque a opção **Public** (Público) para que os visitantes consigam visualizar as imagens sem chaves privadas de autorização.
5. Salve o Bucket. As subpastas internas (`logos`, `hero`, `courts`, `menu`, etc.) serão geradas de forma totalmente transparente e automática no primeiro upload.

#### C. Autenticação (Supabase Google Auth)
Para ativar o login via Google no painel Administrativo (com suporte à sincronização de Agenda e Google Drive):
1. No painel do Supabase, acesse **Authentication** > **Providers** e ative o provider **Google**.
2. Preencha o **Client ID** e o **Client Secret** obtidos no [Google Cloud Console](https://console.cloud.google.com/).
3. Adicione o escopo de leitura e escrita para o Google Drive e Calendar se desejar total integração.
4. *Dica*: O sistema também possui um fallback de login de demonstração totalmente seguro para ambientes locais ou de testes se nenhuma credencial do Google estiver associada.

### 5. Iniciar o Servidor de Desenvolvimento
Com o banco configurado e as tabelas criadas, inicie o ambiente de desenvolvimento local:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador. O banco de dados será populado automaticamente com dados de exemplo (quadras, pratos iniciais, torneios de demonstração) no primeiro carregamento!

---

## 🗄️ Scripts Úteis de Banco de Dados (Drizzle Kit)

O projeto vem pré-configurado com scripts auxiliares para simplificar o controle do banco de dados:

- **Atualizar o Banco**: `npm run db:push` (Sincroniza as alterações do seu arquivo de schema com o banco de dados diretamente, ideal para desenvolvimento).
- **Gerar Migrações**: `npm run db:generate` (Cria arquivos SQL de histórico de alterações de tabelas em `/drizzle`).
- **Interface Visual do Banco**: `npm run db:studio` (Abre o Drizzle Studio no seu navegador em [https://local.drizzle.studio](https://local.drizzle.studio) para você visualizar, editar e excluir registros do banco graficamente).

---

## 📦 Compilação e Produção

Para gerar a build otimizada de produção e rodá-la localmente ou em contêineres Docker/Cloud Run:

1. **Fazer a build**:
   ```bash
   npm run build
   ```
   Isso compilará o frontend estático para a pasta `/dist` e empacotará o servidor Express do backend em um único arquivo CommonJS ultra-eficiente em `/dist/server.cjs`.

2. **Iniciar em Produção**:
   ```bash
   npm start
   ```

---

## 🛡️ Segurança e .gitignore

As configurações sensíveis foram totalmente externalizadas. O arquivo `.gitignore` do projeto está pré-configurado para **garantir que segredos nunca sejam enviados ao GitHub**:

- Arquivos `.env` locais estão ignorados.
- Pastas temporárias de build (`/dist`, `/node_modules`, `.log`) estão ignoradas.

Qualquer pessoa que clonar o projeto terá a garantia de uma execução segura e sem exposição acidental de credenciais privadas.

=======
# jesus-amadoooooo
>>>>>>> c599f71abf7030d1447af38173e9dae864a67ead
