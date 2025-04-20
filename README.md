# Suport Client AWS 🚀

Este projeto simula um sistema de chamados de suporte técnico, como se fosse um sistema de TI de um banco ou empresa, pensado para ser escalável, assíncrono e resiliente. É ideal para cenários onde milhares de mensagens de erro precisam ser processadas de forma segura e eficiente.

---

## 🧠 Tecnologias Utilizadas

- **Node.js** — Backend com Express
- **RabbitMQ** — Fila de mensagens para desacoplamento e escalabilidade
- **AWS DynamoDB** — Banco NoSQL para armazenamento rápido e escalável
- **AWS SDK** — Integração com serviços da AWS
- **dotenv** — Proteção de variáveis sensíveis
- **uuid** — Geração de IDs únicos

---

## 📦 Como Funciona

1. A aplicação recebe requisições HTTP com chamados de suporte (`POST /chamado`).
2. Cada chamado é enviado para uma **fila RabbitMQ**.
3. Um **Consumer** (serviço separado) consome os dados da fila e armazena no **AWS DynamoDB**.
4. Os dados ficam prontos para consultas posteriores, relatórios ou análises.

---

## 🧪 Teste Rápido

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/suport-client-aws.git
cd suport-client-aws
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o `.env`

Crie um arquivo `.env` com as seguintes variáveis (veja o `.env.example`):

```env
RABBITMQ_URL=amqps://usuario:senha@host.cloudamqp.com/vhost
QUEUE=chamados_suporte
```

### 4. Inicie o servidor

```bash
node index.js
```

A API estará rodando em `http://localhost:3000`.

### 5. Envie um chamado (com Postman, Insomnia ou curl.)

```bash
curl -X POST http://localhost:3000/chamado -H "Content-Type: application/json" -d '{
  "cliente": "Lucas Likes",
  "problema": "Erro no sistema de transferências",
  "prioridade": "alta"
}'
```

### 6. Rode o consumer

Em outro terminal:

```bash
node consumer.js
```

As mensagens da fila serão lidas e salvas no DynamoDB.

---

## 🌩️ Expansões Futuras

- Deploy do consumer em **AWS Lambda** (Serverless)
- Substituir RabbitMQ por **Amazon SQS** (com menor gestão de infraestrutura)
- Monitoramento com **AWS CloudWatch**
- Frontend com painel para visualizar chamados

---

## 📁 Estrutura do Projeto

```
suport-client-aws/
├── index.js           # API Express para enviar chamados
├── consumer.js        # Serviço que consome a fila e grava no DynamoDB
├── .env               # Variáveis de ambiente (não versionar)
├── .env.example       # Exemplo de configuração segura
├── package.json
└── README.md
```

---

## 🧠 Boas Práticas Aplicadas

- Variáveis sensíveis com `.env`
- Separação entre produtor e consumidor
- Arquitetura orientada a eventos
- Modelo real de mensageria escalável
- Uso do padrão assíncrono com `async/await`

---

## 👨‍💻 Desenvolvedor

**Lucas Gabriel Likes**  
Desenvolvedor Node.js • Dev Júnior  
🔗 [LinkedIn](https://www.linkedin.com/in/seu-linkedin)  
🐙 [GitHub](https://github.com/seu-usuario)
