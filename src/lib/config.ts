import z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_OPENAI_API_KEY: z.string().trim().min(1),
  NEXT_PUBLIC_PINECONE_API_KEY: z.string().trim().min(1),
  NEXT_PUBLIC_PINECONE_ENVIRONMENT: z.string().trim().min(1),
  NEXT_PUBLIC_PINECONE_INDEX_NAME: z.string().trim().min(1),
  NEXT_PUBLIC_PINECONE_NAME_SPACE: z.string().trim().min(1),
  NEXT_PUBLIC_PDF_PATH: z.string().trim().min(1),
  NEXT_PUBLIC_INDEX_INIT_TIMEOUT: z.coerce.number().min(1),
});

export const env = envSchema.parse(process.env);
