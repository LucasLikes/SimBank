const express = require('express');
const amqp = require('amqplib');
const app = express();
app.use(express.json());

const amqp_url = 'amqps://iavbtmlp:jSGWMf_afzDGBp8wtsI9BxnUaDrj5mQj@jaragua.lmq.cloudamqp.com/iavbtmlp';

async function sendToQueue(msg) {
  const conn = await amqp.connect(amqp_url);
  const channel = await conn.createChannel();
  const queue = 'chamados_suporte';

  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
    persistent: true
  });

  setTimeout(() => {
    conn.close();
  }, 500);
}

app.post('/chamado', async (req, res) => {
    const chamados = Array.isArray(req.body) ? req.body : [req.body];
  
    try {
      for (const chamado of chamados) {
        const { cliente, problema, prioridade } = chamado;
  
        if (!cliente || !problema || !prioridade) {
          return res.status(400).json({ msg: 'Dados incompletos em um dos chamados' });
        }
  
        await sendToQueue({
          cliente,
          problema,
          prioridade,
          horario: new Date().toISOString()
        });
      }
  
      res.status(200).json({ msg: 'Todos os chamados foram enviados com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Erro ao enviar chamados' });
    }
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
