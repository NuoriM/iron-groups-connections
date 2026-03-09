// layouts/MainLayout.jsx
import { useNavigate } from "react-router";

export default function MainLayout({ children, endContent }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", icon: "pi pi-home", command: () => navigate("/") },
    {
      label: "Grafos",
      icon: "pi-chart-scatter",
      items: [{ label: "Grupos", url: "/grafo-grupos" }],
    },
  ];

  return (
    <>
      {/* <NavbarComponent items={menuItems} endContent={endContent} className="sm-menubar" /> */}
      <main>{children}</main>
    </>
  );
}
