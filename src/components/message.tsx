import React from "react";
import cx from "@/utils/cx";
import { Message as MessageProps } from "ai/react";
import Image from "next/image";
import { IconUser } from "@tabler/icons-react";
import assistant from "@/utils/assistant";
import Markdown, { RuleType } from "markdown-to-jsx";
import TeX from "@matejmazur/react-katex";

interface MessagePropsMod extends MessageProps {
  assistantId: number;
}

const Message: React.FC<MessagePropsMod> = ({ content, role, assistantId }) => {
  const isUser = role === "user";

  return (
    <article
      className={cx(
        "mb-6 flex items-start gap-4 p-4 md:p-5 rounded-2xl",
        isUser ? "" : "bg-gradient-to-b from-violet-100 to-violet-50",
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
            code: ({ children }) => (
              <TeX as="div">{String.raw`${children}`}</TeX>
            ),
          },
          renderRule(next, node, renderChildren, state) {
            console.log({ node });
            if (node.type === "3" && node.lang === "latex") {
              return (
                <TeX as="div" key={state.key}>{String.raw`${node.text}`}</TeX>
              );
            }

            return next();
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
        isUser ? "bg-gray-200 text-gray-700" : "bg-violet-950",
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
