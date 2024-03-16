import { NextRequest, NextResponse } from "next/server";
import { getPineconeClient } from "@/lib/pinecone-client";
import { getChunkedDocsFromPDF } from "@/lib/pdf-loader";
import { pineconeEmbedAndStore } from "@/lib/vector-store";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const pdf = data.get("pdf") as File;

  if (!pdf) {
    return NextResponse.json("Error: No PDF file in request", {
      status: 400,
    });
  }

  try {
    const pineconeClient = await getPineconeClient();
    const docs = await getChunkedDocsFromPDF(pdf);
    await pineconeEmbedAndStore(pineconeClient, docs);

    return new Response("Data embedded and stored in pine-cone index");
  } catch (error) {
    console.error("Internal server error ", error);
    return NextResponse.json("Error: Something went wrong. Try again!", {
      status: 500,
    });
  }
}
