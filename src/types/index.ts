export type ChatGPTAgent = "user" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
  sources?: DocumentInfo[];
}

export type DocumentInfo = {
  pageContent: string;
  line_from: number;
  line_to: number;
  page_no: number;
};
