import React from "react";
import Markdown from "markdown-to-jsx";
import cx from "@/utils/cx";
import { Message as MessageProps } from "ai/react";
import Image from "next/image";
import { IconUser } from "@tabler/icons-react";
import assistant from "@/utils/assistant";

interface MessagePropsMod extends MessageProps {
  assistantId: number;
}

const Message: React.FC<MessagePropsMod> = ({ content, role, assistantId }) => {
  const isUser = role === "user";

  return (
    <article
      className={cx(
        "mb-4 flex items-start gap-4 p-4 md:p-5 rounded-2xl",
        isUser ? "" : "bg-gradient-to-b from-emerald-100 to-emerald-50",
      )}
    >
      {<Avatar isUser={isUser} assistantId={assistantId} />}
      <Markdown
        className={cx(
          "py-1.5 md:py-1 space-y-4",
          isUser ? "font-semibold" : "",
        )}
        options={{
          overrides: {
            ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
            ul: ({ children }) => <ol className="list-disc">{children}</ol>,
          },
        }}
      >
        {content}
      </Markdown>
    </article>
  );
};

const Avatar: React.FC<{
  isUser?: boolean;
  className?: string;
  assistantId: number;
}> = ({ isUser = false, className, assistantId }) => {
  return (
    <div
      className={cx(
        "flex items-center justify-center size-10 shrink-0 rounded-full",
        isUser ? "bg-gray-200 text-gray-700" : "bg-emerald-950",
        className,
      )}
    >
      {isUser ? (
        <IconUser size={20} />
      ) : (
        <Image
          className="w-10 h-10 rounded-full"
          src={assistant[assistantId]?.avatar || "/icon-user.png"}
          width={20}
          height={20}
          alt="Avatar"
        />
      )}
    </div>
  );
};

export default Message;
export { Avatar };
