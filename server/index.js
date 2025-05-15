import express from 'express';
import cors from 'cors';
import { agent } from './agent.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/generate', async (req, res) => {
  try {
    const { query, thread_id } = req.body;
    console.log('Incoming query:', query);

    const result = await agent.invoke(
      {
        messages: [{ role: 'user', content: query }],
      },
      { configurable: { thread_id } }
    );

    const answer = result.messages.at(-1)?.content ?? '';
    console.log('Agent answer:', answer);

    return res.json({ answer });
  } catch (error) {
    console.error('Agent invocation error:', error);
    return res.status(500).json({ error: 'Error interno del agente' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
