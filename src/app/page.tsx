"use client";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { Chat } from "@/components/chat";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../public/pdf-bot-with-character.jpg";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [dropzoneContent, setDropzoneContent] = useState(
    "Drag 'n' drop a pdf here, or click to select pdf to start the conversation"
  );
  const [showChat, setShowChat] = useState(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  useEffect(() => {
    if (acceptedFiles.length === 0) return;

    setIsLoading(true);
    setShowChat(false);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("pdf", file);
    const uploadToPinecone = async () => {
      const response = await fetch("/api/upload-chunk", {
        method: "POST",
        body: formData,
      });

      setIsLoading(false);
      setShowChat(true);
      setDropzoneContent(file?.name);
    };

    uploadToPinecone();
  }, [acceptedFiles]);

  return (
    <main className="relative container flex min-h-screen flex-col">
      <div className="py-4 flex min-h-14 justify-between supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div>
          <Image
            src={logo}
            alt="PDF Bot"
            width={200}
            height={100}
            className="rounded-md object-cover"
          />
        </div>

        <DarkModeToggle />
      </div>
      <Card
        {...getRootProps({
          className: `dropzone border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50 ${
            isLoading && "opacity-50 pointer-events-none"
          }`,
        })}
      >
        <CardContent className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-lg">
          <div>
            <input {...getInputProps()} />
            {isLoading ? (
              <div className="flex items-center">
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <p>{dropzoneContent}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 py-4">
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{
                opacity: 0,
                y: -80,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              exit={{
                opacity: 0,
                y: -80,
              }}
              className="w-full"
            >
              <Chat fileName={acceptedFiles[0]?.name} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
