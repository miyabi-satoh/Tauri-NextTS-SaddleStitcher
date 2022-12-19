import React, { useCallback, useContext, useEffect, useState } from "react";

interface Message {
  msg: string;
  className: string;
}

const MessageContext = React.createContext(
  {} as {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    addMessage: (msg: string, className?: string) => void;
    clearMessages: () => void;
  }
);

export const useMessageContext = () => {
  return useContext(MessageContext);
};

export const MessageProvider = (props: React.PropsWithChildren) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback(
    (msg: string, className?: string) => {
      if (typeof msg === "string") {
        const messages = msg.split("\n").map((m) => {
          return {
            msg: m,
            className: className || "",
          };
        });

        setMessages((current) => [...current, ...messages].slice(-100));
      }
    },
    [setMessages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const value = {
    messages,
    setMessages,
    addMessage,
    clearMessages,
  };

  return (
    <MessageContext.Provider value={value}>
      {props.children}
    </MessageContext.Provider>
  );
};

export const Console = () => {
  const { messages } = useMessageContext();
  const ref = React.createRef<HTMLDivElement>();

  const scrollToBottom = useCallback(() => {
    ref!.current!.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [ref]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-1/3 border-t border-gray-500 flex flex-col text-xs">
      <div className="px-4 py-2 font-bold">動作ログ</div>
      <div className="px-4 overflow-y-scroll flex-auto">
        {messages.map((message, index) => (
          <pre
            key={`console-${index}`}
            className={`break-all whitespace-pre-wrap ${message.className}`}
          >
            {message.msg}
          </pre>
        ))}
        <div className="my-1" ref={ref} />
      </div>
    </div>
  );
};
