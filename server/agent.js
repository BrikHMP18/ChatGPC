import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from '@langchain/langgraph';

import { vectorStore, addDocumentToVectorStore } from './embeddings.js';
import data from './data.js';

// Cargar todos los documentos al vector store
await addDocumentToVectorStore(data);

// Herramienta de recuperación (sin filtro por doc_id)
const retrievalTool = tool(
  async ({ query }) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 5);

    const serializedDocs = retrievedDocs
      .map((doc) =>
        `La siguiente información proviene del documento: «${doc.metadata.title}»\n${doc.pageContent}`
      )
      .join('\n\n');

    return serializedDocs;
  },
  {
    name: 'retrieve',
    description: 'Retrieve the most relevant documents from the vector store',
    schema: z.object({
      query: z.string(),
    }),
  }
);

// LLM
const llm = new ChatOpenAI({
  modelName: 'gpt-4.1-mini',
});

// Memoria del agente
const checkpointer = new MemorySaver();

const agent = createReactAgent({
  llm,
  tools: [retrievalTool],
  checkpointer,
  system: `Eres un asistente experto en salud.
Debes responder de forma precisa y útil. Siempre que uses contenido recuperado, menciona de qué documento proviene.
Puedes hacerlo al inicio o al final de la respuesta con: "Fuente: <título del documento>". Si usaste varios, sepáralos por coma.
Si no encuentras la información, dilo con claridad.`,
});

// Test del agente
console.log('Q1: ¿Cuál es la función de la Dirección de Investigación en Salud del IETSI y de dónde obtuviste esa información?');
const result = await agent.invoke(
  {
    messages: [
      {
        role: 'user',
        content: '¿Cuál es la función de la Dirección de Investigación en Salud del IETSI y de dónde obtuviste esa información?',
      },
    ],
  },
  { configurable: { thread_id: '1' } }
);

console.log(result.messages.at(-1)?.content);
