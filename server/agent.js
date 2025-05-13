import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { tool } from '@langchain/core/tools'
import { z } from 'zod';


import data from './data.js';

const doc1 = data[0];

const docs = [new Document({pageContent: doc1.content})];
  

// Split the documents into chunks
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const chunks = await splitter.splitDocuments(docs);

//console.log(chunks);

// Embed the chunks
const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-large',
});

const vectorSore = new MemoryVectorStore(embeddings);

await vectorSore.addDocuments(chunks);

// retrieve the most relevant chunks
const retrievedDocs = await vectorSore.similaritySearch(
    'Cuales son las areas del IETSI?',
    1
);

// console.log('Retrieved documents:--------------------------------');
// console.log(retrievedDocs);

// Retrieval tool
const retrievalTool = tool(async ({query}) => {
    console.log('Retrieving documents for query: ------------------------');
    console.log(query);
    const retrievedDocs = await vectorSore.similaritySearch(query,5);

    const serializedDocs = retrievedDocs
        .map((doc) => doc.pageContent)
        .join('\n');

    return serializedDocs;
},{
    name: 'retrieve',
    description: 
        'Retrieve the most relevant documents from the vector store',
    schema:z.object({
        query: z.string(),
    }),
});

const llm = new ChatOpenAI({
  modelName: 'gpt-4o-mini', // o 'gpt-3.5-turbo' si querés ahorrar costos
});

const agent = createReactAgent({ llm, tools: [retrievalTool] });

const result = await agent.invoke({
    messages: [{role: 'user', content: 'Cuales son las areas del IETSI?'}]
});

console.log(result.messages.at(-1)?.content);

 