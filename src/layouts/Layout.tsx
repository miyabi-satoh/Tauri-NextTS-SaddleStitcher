import React from "react";
import { Console, MessageProvider } from "~/components/Console";

export const Layout = (props: React.PropsWithChildren) => {
  return (
    <MessageProvider>
      <div className="h-screen flex flex-col">
        <div className="flex-auto">{props.children}</div>
        <Console />
      </div>
    </MessageProvider>
  );
};
