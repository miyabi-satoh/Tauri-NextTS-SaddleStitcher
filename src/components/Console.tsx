import React, { useContext, useState } from "react";

const MessageContext = React.createContext(
  {} as {
    messages: string[];
    setMessages: React.Dispatch<React.SetStateAction<string[]>>;
    addMessage: (msg: string) => void;
  }
);

export const useMessageContext = () => {
  return useContext(MessageContext);
};

export const MessageProvider = (props: React.PropsWithChildren) => {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = (msg: string) => {
    setMessages((current) => [...current, ...msg.split("\n")].slice(-100));
  };

  const value = {
    messages,
    setMessages,
    addMessage,
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

  const scrollToBottom = React.useCallback(() => {
    ref!.current!.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [ref]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-1/3 border-t border-gray-500 flex flex-col text-xs">
      <div className="px-4 py-2 font-bold">動作ログ</div>
      <div className="px-4 overflow-y-scroll flex-auto">
        {messages.map((line, index) => (
          <pre key={`console-${index}`} className="whitespace-pre-wrap">
            {line}
          </pre>
        ))}
        <div className="my-1" ref={ref} />
      </div>
    </div>
  );
};
