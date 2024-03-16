import Balancer from "react-wrap-balancer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChatGPTMessage } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";
import { sanitizeAndFormatText } from "@/lib/utils";
import { Bot } from "lucide-react";

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) => {
  return text.split("\n").map((paragraph, i) => <p key={i}>{paragraph}</p>);
};

const transformParagraph = (paragraph: string) => {
  const transformedParagraph = paragraph
    .replace(/###/g, "")
    .replace(/\*\*(.*?)\*\*/g, `<p className="fw-bold">$1</p>`);
  return transformedParagraph;
};

export function ChatLine({
  role = "assistant",
  content,
  sources,
}: ChatGPTMessage) {
  if (!content) {
    return null;
  }

  const formattedMessage = convertNewLines(transformParagraph(content));

  return (
    <div>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle
            className={
              role != "assistant"
                ? "text-amber-500 dark:text-amber-200"
                : "text-blue-500 dark:text-blue-200"
            }
          >
            {role == "assistant" ? (
              <div className="flex items-center">
                <Bot className="mr-2"/>
                <span>Your Assistant</span>
              </div>
            ) : (
              "You"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <Balancer>{formattedMessage}</Balancer>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full">
            {sources ? (
              <Accordion type="single" collapsible className="w-full">
                {sources.map((source: any, index) => (
                  <AccordionItem value={`source-${index}`} key={index}>
                    <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
                    <AccordionContent>
                      <ReactMarkdown linkTarget="_blank">
                        {sanitizeAndFormatText(source)}
                      </ReactMarkdown>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <></>
            )}
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
