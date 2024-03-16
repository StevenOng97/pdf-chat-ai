import { PineconeClient } from "@pinecone-database/pinecone";
import { env } from "./config";
import { delay } from "./utils";

let pineconeClientInstance: PineconeClient | null = null;

async function createIndex(client: PineconeClient, indexName: string) {
  try {
    await client.createIndex({
      createRequest: {
        name: indexName,
        dimension: 1536,
        metric: "cosine",
      },
    });
    console.log(
      `Waiting for ${env.NEXT_PUBLIC_INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
    );
    await delay(env.NEXT_PUBLIC_INDEX_INIT_TIMEOUT);
    console.log("Index created !!");
  } catch (error) {
    console.error("error ", error);
    throw new Error("Index creation failed");
  }
}

async function initPineconeClient() {
  try {
    const pineconeClient = new PineconeClient();
    await pineconeClient.init({
      apiKey: env.NEXT_PUBLIC_PINECONE_API_KEY,
      environment: env.NEXT_PUBLIC_PINECONE_ENVIRONMENT,
    });
    const indexName = env.NEXT_PUBLIC_PINECONE_INDEX_NAME;

    const existingIndexes = await pineconeClient.listIndexes();

    if (!existingIndexes.includes(indexName)) {
      createIndex(pineconeClient, indexName);
    } else {
      console.log("Your index already exists. nice !!");
    }

    return pineconeClient;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }

  return pineconeClientInstance;
}
