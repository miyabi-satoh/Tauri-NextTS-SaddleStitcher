export type OverlayShowType = "spinner" | "children" | "none";

export type OverlayProps = {
  show: OverlayShowType;
};

export const Overlay = (props: React.PropsWithChildren<OverlayProps>) => {
  switch (props.show) {
    case "spinner":
      return (
        <div className="overlay">
          <div className="spinner" />
        </div>
      );
    case "children":
      return <div className="overlay flex-col">{props.children}</div>;
  }

  return null;
};
