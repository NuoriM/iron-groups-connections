import { Menubar } from "primereact/menubar";

export default function NavbarComponent ({ items, endContent = [], className = '' }) {
  return (
    <Menubar
      className={className}
      model={items}
      end={endContent}
      style={{
        position: "fixed",
        top: 0,
        background: "transparent",
        border: 0,
        backdropFilter: "blur(3px)",
        left: 0,
        width: "100%",
        zIndex: 2020,
      }}
    />
  );
};
