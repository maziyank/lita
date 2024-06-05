"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Message as MessageProps, useChat } from "ai/react";
import Form from "@/components/form";
import Message from "@/components/message";
import cx from "@/utils/cx";
import MessageLoading from "@/components/message-loading";
import { INITIAL_QUESTIONS } from "@/utils/const";
import Image from "next/image";
import {
  IconArrowRight,
  IconLighter,
  IconQuestionMark,
} from "@tabler/icons-react";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [streaming, setStreaming] = useState<boolean>(false);
  const [assistantId, setAssistantId] = useState(0);

  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      api: `/api/guru/${assistantId}`,
      initialMessages: [],
      onResponse: () => {
        setStreaming(false);
      },
    });

  const handleAssitantChange = (value: number) => {
    setAssistantId(value);
  };

  const onClickQuestion = (value: string) => {
    setInput(value);
    setTimeout(() => {
      formRef.current?.dispatchEvent(
        new Event("submit", {
          cancelable: true,
          bubbles: true,
        }),
      );
    }, 1);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSubmit(e);
      setStreaming(true);
    },
    [handleSubmit],
  );

  return (
    <main className="relative max-w-screen-md p-4 md:p-6 mx-auto flex min-h-svh !pb-32 md:!pb-40 overflow-y-auto">
      <div className="w-full mb-16">
        <div className="mb-2 flex items-start gap-2 p-4 md:p-5 rounded-2xl bg-gradient-to-b from-emerald-100 to-emerald-50">
          <Image src="/logo.png" alt="Logo" height={70} width={70} />
          <div className="flex flex-col align-middle pt-2">
            <span className="font-bold">Selamat Datang di Ruang Pelitaku</span>
            <span>
              Unopininated and ultimate companion for improving your financial
              literacy.
            </span>
          </div>
        </div>
        {messages.map((message: MessageProps) => {
          return (
            <Message key={message.id} assistantId={assistantId} {...message} />
          );
        })}

        {/* loading */}
        {streaming && <MessageLoading />}

        {/* initial question */}
        {messages.length === 0 && (
          <div className="mt-4 md:mt-6 grid md:grid-cols-2 gap-2 md:gap-4">
            {INITIAL_QUESTIONS.map((message) => {
              return (
                <button
                  key={message.content}
                  type="button"
                  className="flex cursor-pointer select-none text-left bg-white font-normal
                  border border-gray-200 rounded-xl p-3 md:px-4 md:py-3
                  hover:bg-zinc-50 hover:border-zinc-400"
                  onClick={() => onClickQuestion(message.content)}
                >
                  <IconArrowRight /> {message.content}
                </button>
              );
            })}
          </div>
        )}

        {/* bottom ref */}
        <div ref={messagesEndRef} />
      </div>

      <div
        className={cx(
          "fixed z-10 bottom-0 inset-x-0",
          "flex justify-center items-center",
          "bg-white",
        )}
      >
        <span
          className="absolute bottom-full h-10 inset-x-0 from-white/0
         bg-gradient-to-b to-white pointer-events-none"
        />

        <div className="w-full max-w-screen-md rounded-xl px-4 md:px-5 py-6">
          <Form
            ref={formRef}
            onSubmit={onSubmit}
            inputProps={{
              disabled: streaming,
              value: input,
              onChange: handleInputChange,
            }}
            onAssitantChanged={handleAssitantChange}
            buttonProps={{
              disabled: streaming,
            }}
          />
        </div>
      </div>
    </main>
  );
}
