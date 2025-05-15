import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";

const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-large',
});
export const vectorStore = await PGVectorStore.initialize(embeddings, {
    postgresConnectionOptions: {
        connectionString: process.env.DB_URL,
    },
    tableName: 'documents',
    columns: {
        idColumnName: 'id',
        vectorColumnName: 'vector',
        contentColumnName: 'content',
        metadataColumnName: 'metadata',
    },
    distanceStrategy: 'cosine',
})

export const addDocumentToVectorStore = async (docArray) => {
  const docs = docArray.map(doc =>
    new Document({
      pageContent: doc.content,
      metadata: {
        id: doc.id,
        title: doc.title,
        ...doc.metadata,
      },
    })
  );

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);
  await vectorStore.addDocuments(chunks);
};
