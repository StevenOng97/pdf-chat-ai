import { env } from "./config";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";

export async function pineconeEmbedAndStore(
  client: PineconeClient,
  // @ts-ignore docs type error
  docs: Document<Record<string, any>>[]
) {
  /*create and store the embeddings in the vectorStore*/
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    const index = client.Index(env.NEXT_PUBLIC_PINECONE_INDEX_NAME);

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: env.NEXT_PUBLIC_PINECONE_NAME_SPACE,
      textKey: "text",
    });
  } catch (error) {
    console.log("error ", error);
    throw new Error("Failed to load your docs !");
  }
}

export async function getVectorStore(client: PineconeClient) {
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    const index = client.Index(env.NEXT_PUBLIC_PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
      namespace: env.NEXT_PUBLIC_PINECONE_NAME_SPACE,
    });

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}
