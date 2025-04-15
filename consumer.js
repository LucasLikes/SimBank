const amqp = require('amqplib');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require('uuid');

const RABBITMQ_URL = 'amqps://iavbtmlp:jSGWMf_afzDGBp8wtsI9BxnUaDrj5mQj@jaragua.lmq.cloudamqp.com/iavbtmlp';
const QUEUE = 'chamados_suporte';

const client = new DynamoDBClient({ region: "sa-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

async function startConsumer() {
    try {
        const conn = await amqp.connect(RABBITMQ_URL);
        const channel = await conn.createChannel();

        await channel.assertQueue(QUEUE, { durable: true });

        console.log(`Aguardando mensagens na fila: ${QUEUE}`);

        channel.consume(QUEUE, async (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                console.log("Recebido:", content);

                const item = {
                    id: uuidv4(),
                    cliente: content.cliente,
                    problema: content.problema,
                    prioridade: content.prioridade,
                    criado_em: new Date().toISOString()
                };

                try {
                    await ddbDocClient.send(new PutCommand({
                        TableName: "ChamadosSuporte",
                        Item: item
                    }));
                    console.log("Inserido no DynamoDB:", item);
                } catch (err) {
                    console.error("Erro ao inserir no DynamoDB:", err);
                }

                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error("Erro ao iniciar o consumer:", error);
    }
}

startConsumer();
