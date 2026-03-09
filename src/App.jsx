// App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import GrafoGrupos from "./pages/Grafo-Grupos";
import Home from "./pages/Home";

function HomePage() {
  return <Home></Home>;
}

function GrafoPage() {
  return <GrafoGrupos></GrafoGrupos>;
}

function App() {

  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grafo-grupos" element={<GrafoPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
