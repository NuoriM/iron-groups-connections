// src/pages/Grafo.jsx
import { useEffect, useState, useRef } from "react";
import { Cosmograph, prepareCosmographData } from "@cosmograph/react";
import grafoData from "../data/ironhotel_graph_positioned.json";
import { Sidebar } from "primereact/sidebar";
import { AutoComplete } from "primereact/autocomplete";
import ConnectionListComponent from "../components/Connection-List.component";
import MainLayout from "../components/Main-Layout.component";
import { Checkbox } from "primereact/checkbox";
import { useNavigate } from "react-router";

export default function GrafoGrupos() {
  const [config, setConfig] = useState({});
  const cosmographRef = useRef(null);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [visibleRight, setVisibleRight] = useState(false);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState(null);
  const searchPointsRef = useRef([]);
  const [grafoOptions, setGrafoOptions] = useState(["labels", "simulation"]);
  const [globalStats, setGlobalStats] = useState({ groups: 0, members: 0 });
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const edgesRef = useRef([]);
  const nodeMapRef = useRef({});

  const onOptionsChange = (e) => {
    let _options = [...grafoOptions];

    if (e.checked) _options.push(e.value);
    else _options.splice(_options.indexOf(e.value), 1);

    setGrafoOptions(_options);
    toggleSimulation(_options);
  };

  useEffect(() => {
    const loadData = async () => {
      const dataConfig = {
        points: {
          pointIdBy: "id",
          pointLabelBy: "label",
          pointColorBy: "color",
          pointFields: ["color"],
          showHoveredPointLabel: true,
        },
        links: {
          linkSourceBy: "source",
          linkTargetsBy: ["target"],
          linkColorBy: "color",
          linkFields: ["color"],
        },
      };
      const rawLinksData = Object.values(grafoData.edges || {});

      const enhancedPoints = grafoData.nodes.map((n) => {
        const color = n.attributes?.type === "group" ? "#ff3e3e" : "#ffa53e";
        const { type, ...restAttributes } = n.attributes || {};
        return {
          id: n.id,
          label: n.attributes?.name || "",
          color,
          type,
          attributes: restAttributes,
        };
      });

      const groupCount = enhancedPoints.filter(
        (n) => n.type === "group",
      ).length;
      const memberCount = enhancedPoints.filter(
        (n) => n.type !== "group",
      ).length;
      setGlobalStats({ groups: groupCount, members: memberCount });

      nodeMapRef.current = enhancedPoints.reduce((map, node) => {
        map[node.id] = node;
        return map;
      }, {});

      edgesRef.current = rawLinksData;

      const rawLinks = rawLinksData.map((link) => ({
        source: link.source,
        target: link.target,
        color: "#570c29",
      }));
      const result = await prepareCosmographData(
        dataConfig,
        enhancedPoints,
        rawLinks,
      );

      if (result) {
        const { points, links, cosmographConfig } = result;
        const indexToNode = Array.from(result.points).map(
          (p) => nodeMapRef.current[p.id],
        );
        searchPointsRef.current = indexToNode;
        setConfig({
          points,
          links,
          ...cosmographConfig,
          linkDefaultWidth: 3,
        });
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (cosmographRef.current && config.points?.length > 0) {
      const indices = Array.from({ length: config.points.length }, (_, i) => i);
      cosmographRef.current.trackPointPositionsByIndices(indices);
    }
  }, [config]);

  const search = (event) => {
    const query = event.query.toLowerCase();

    const filtered = searchPointsRef.current
      .filter((p) => p.label?.toLowerCase().includes(query))
      .slice(0, 20);

    setItems(filtered);
  };

  const selectNode = (clicked_node, isSearching = false) => {
    if (!clicked_node) return;

    const cosmo = cosmographRef.current;
    if (!cosmo) return;

    const index = searchPointsRef.current.findIndex(
      (p) => p.id === clicked_node.id,
    );

    if (index === -1) return;

    if (isSearching) cosmo.zoomToPoint(index, 2500, 30, true);
    cosmo.setFocusedPoint(index);
    cosmo.selectPoint(index, true, true);
  };

  const toggleSimulation = (options) => {
    if (options.includes("simulation")) {
      cosmographRef.current?.unpause();
    } else {
      cosmographRef.current?.pause();
    }
  };

  const handleClick = (pointIndex) => {
    if (pointIndex) {
      setVisibleRight(true);
    } else {
      setVisibleRight(false);
    }
    if (!pointIndex) return;

    const points = searchPointsRef.current;
    const clickedPoint = points[pointIndex];
    if (!clickedPoint) return;

    const info = buildNodeInfo(clickedPoint.id);
    setSelectedNodeInfo(info);
    selectNode(clickedPoint);
  };

  const buildNodeInfo = (nodeId) => {
    const nodeMap = nodeMapRef.current;
    const edges = edgesRef.current;
    const node = nodeMap[nodeId];
    if (!node) return null;

    const outgoing = edges
      .filter((e) => String(e.source) === String(nodeId))
      .map((e) => nodeMap[String(e.target)])
      .filter(Boolean);

    const incoming = edges
      .filter((e) => String(e.target) === String(nodeId))
      .map((e) => nodeMap[String(e.source)])
      .filter(Boolean);

    return { node, outgoing, incoming };
  };

  const end = (
    <div className="flex align-items-center gap-2">
      <AutoComplete
        value={value}
        suggestions={items}
        completeMethod={search}
        field="label"
        virtualScrollerOptions={{ itemSize: 38 }}
        className="sm:w-auto"
        onChange={(e) =>
          setValue(typeof e.value === "string" ? e.value : e.value?.label)
        }
        onSelect={(e) => {
          selectNode(e.value, true);
          setValue("");
        }}
      />
    </div>
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: "8",
          padding: "8px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-red-600 bg-transparent border border-red-600 hover:bg-red-600 hover:text-white focus:ring-2 focus:ring-red-900 font-medium text-sm px-4 py-2.5 rounded-lg focus:outline-none transition-colors duration-200"
        >
          <i className="pi pi-angle-left mr-1" />
          Voltar
        </button>
      </div>
      <MainLayout endContent={end}>
        <Cosmograph
          className="cosmoFullPage"
          ref={cosmographRef}
          {...config}
          pointSizeScale={0.3}
          pointSizeStrategy="direct"
          curvedLinks={true}
          linkColorStrategy="direct"
          pointColorStrategy="direct"
          simulationRepulsion={2}
          pointColorBy="color"
          scalePointsOnZoom={true}
          scaleLinksOnZoom={false}
          linkColorBy="color"
          backgroundColor="#030712"
          showLabels={grafoOptions.includes("labels")}
          simulationLinkDistance={1.3}
          enableSimulationDuringZoom={true}
          linkDefaultWidth={3}
          linkWidthRange={[0.5, 3.0]}
          linkVisibilityMinTransparency={1}
          simulationRepulsionTheta={0.8}
          highlightSelectedData={true}
          selectConnectedPointsOnClick={true}
          onClick={handleClick}
          selectPointOnClick
        />

        <Sidebar
          visible={visibleRight}
          position="right"
          showCloseIcon={false}
          dismissable={false}
          closeOnEscape={false}
          modal={false}
          onHide={() => setVisibleRight(false)}
          style={{
            width: "340px",
            padding: 0,
            zIndex: 2025,
            background: "#0a0a0f",
            borderLeft: "1px solid rgba(127,29,29,0.4)",
          }}
        >
          {selectedNodeInfo ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                color: "#e5e7eb",
              }}
            >
              <div
                style={{
                  padding: "20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  borderBottom: "1px solid rgba(127,29,29,0.4)",
                  background: "rgba(69,10,10,0.25)",
                }}
              >
                {selectedNodeInfo.node.attributes.image ? (
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "2px solid rgba(185,28,28,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: "rgba(0,0,0,0.4)",
                    }}
                  >
                    <img
                      src={`https://cdn.ironhotel.org/group-badge/${selectedNodeInfo.node.attributes.image}.gif`}
                      alt="emblema"
                      style={{
                        imageRendering: "pixelated",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "12px",
                      border: "2px solid rgba(185,28,28,0.4)",
                      background: "rgba(69,10,10,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedNodeInfo.node.type === "group" ? (
                      <i
                        className="pi pi-users"
                        style={{ fontSize: "2.5rem", color: "#ff3e3e" }}
                      />
                    ) : (
                      <i
                        className="pi pi-user"
                        style={{ fontSize: "2.5rem", color: "#ffa53e" }}
                      />
                    )}
                  </div>
                )}

                <div style={{ textAlign: "center" }}>
                  <h2
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "16px",
                      fontWeight: 700,
                      lineHeight: 1.3,
                      color: "#f3f4f6",
                    }}
                  >
                    {selectedNodeInfo.node.label || selectedNodeInfo.node.id}
                  </h2>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color:
                        selectedNodeInfo.node.type === "group"
                          ? "#ff6b6b"
                          : "#ffa94d",
                      background:
                        selectedNodeInfo.node.type === "group"
                          ? "rgba(255,62,62,0.12)"
                          : "rgba(255,165,62,0.12)",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      border: `1px solid ${selectedNodeInfo.node.type === "group" ? "rgba(255,107,107,0.3)" : "rgba(255,169,77,0.3)"}`,
                    }}
                  >
                    {selectedNodeInfo.node.type === "group"
                      ? "Grupo"
                      : "Membro"}
                  </span>
                </div>
              </div>

              <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
                {/* {Object.entries(selectedNodeInfo.node.attributes).filter(
                ([k]) => k !== "image" && k !== "name",
              ).length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#999",
                      marginBottom: "8px",
                    }}
                  >
                    Detalhes
                  </p>
                  <div
                    style={{
                      background: "#f8f8f8",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      fontSize: "13px",
                    }}
                  >
                    {Object.entries(selectedNodeInfo.node.attributes)
                      .filter(([k]) => k !== "image" && k !== "name")
                      .map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "4px 0",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <span
                            style={{
                              color: "#999",
                              textTransform: "capitalize",
                            }}
                          >
                            {k}
                          </span>
                          <span style={{ fontWeight: 500, color: "#333" }}>
                            {String(v)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )} */}

                <ConnectionListComponent
                  title={
                    selectedNodeInfo.node.type === "group"
                      ? `Membros (${selectedNodeInfo.outgoing.length})`
                      : `Grupos (${selectedNodeInfo.incoming.length})`
                  }
                  nodes={
                    selectedNodeInfo.node.type === "group"
                      ? selectedNodeInfo.outgoing
                      : selectedNodeInfo.incoming
                  }
                  emptyMsg={
                    selectedNodeInfo.node.type === "group"
                      ? "Sem membros"
                      : "Sem grupos"
                  }
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "32px", opacity: 0.15 }}>⚡</span>
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: "13px",
                  margin: 0,
                  color: "#374151",
                }}
              >
                Clique em um nó para ver detalhes.
              </p>
            </div>
          )}
        </Sidebar>

        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 8,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(3,7,18,0.80)",
            backdropFilter: "blur(14px)",
            border: `1px solid ${searchFocused ? "rgba(185,28,28,0.8)" : "rgba(127,29,29,0.4)"}`,
            borderRadius: "12px",
            padding: "9px 14px",
            boxShadow: searchFocused
              ? "0 0 0 3px rgba(185,28,28,0.12), 0 8px 32px rgba(0,0,0,0.6)"
              : "0 4px 24px rgba(0,0,0,0.5)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        >
          <i
            className="pi pi-search"
            style={{ fontSize: "0.85rem", color: "#4b5563", flexShrink: 0 }}
          />
          <AutoComplete
            className="iron-search"
            value={value}
            suggestions={items}
            completeMethod={search}
            field="label"
            placeholder="Buscar grupo ou membro..."
            virtualScrollerOptions={{ itemSize: 38 }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onChange={(e) =>
              setValue(typeof e.value === "string" ? e.value : e.value?.label)
            }
            onSelect={(e) => {
              selectNode(e.value, true);
              setValue("");
            }}
          />
          {value && (
            <button
              onClick={() => setValue("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#4b5563",
                padding: 0,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
            >
              <i className="pi pi-times" style={{ fontSize: "0.75rem" }} />
            </button>
          )}
        </div>

        <div
          style={{
            zIndex: 8,
            position: "absolute",
            bottom: 16,
            left: 16,
            padding: "10px 14px",
            background: "rgba(3,7,18,0.80)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(127,29,29,0.35)",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex flex-wrap justify-content-center gap-3">
            <div className="flex align-items-center">
              <Checkbox
                inputId="option1"
                name="grafo"
                value="simulation"
                onChange={onOptionsChange}
                checked={grafoOptions.includes("simulation")}
                pt={{
                  box: {
                    style: {
                      borderColor: "rgba(185,28,28,0.5)",
                      background: grafoOptions.includes("simulation")
                        ? "#b91c1c"
                        : "transparent",
                    },
                  },
                }}
              />
              <label
                htmlFor="option1"
                className="ml-2"
                style={{
                  color: "#9ca3af",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Simulação
              </label>
            </div>
            <div className="flex align-items-center">
              <Checkbox
                inputId="option2"
                name="grafo"
                value="labels"
                onChange={onOptionsChange}
                checked={grafoOptions.includes("labels")}
                pt={{
                  box: {
                    style: {
                      borderColor: "rgba(185,28,28,0.5)",
                      background: grafoOptions.includes("labels")
                        ? "#b91c1c"
                        : "transparent",
                    },
                  },
                }}
              />
              <label
                htmlFor="option2"
                className="ml-2"
                style={{
                  color: "#9ca3af",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Mostrar Labels
              </label>
            </div>
          </div>
        </div>

        <div
          style={{
            zIndex: 8,
            position: "absolute",
            bottom: 16,
            right: 16,
            display: "flex",
            gap: "8px",
          }}
        >
          <div
            style={{
              backdropFilter: "blur(12px)",
              background: "rgba(3,7,18,0.80)",
              border: "1px solid rgba(185,28,28,0.3)",
              borderRadius: "10px",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            <i
              className="pi pi-users"
              style={{ fontSize: "1rem", color: "#ff3e3e" }}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#ff3e3e",
                  letterSpacing: "-0.5px",
                }}
              >
                {globalStats.groups}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#4b5563",
                }}
              >
                Grupos
              </div>
            </div>
          </div>

          <div
            style={{
              backdropFilter: "blur(12px)",
              background: "rgba(3,7,18,0.80)",
              border: "1px solid rgba(255,165,62,0.25)",
              borderRadius: "10px",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            <i
              className="pi pi-user"
              style={{ fontSize: "1rem", color: "#ffa53e" }}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#ffa53e",
                  letterSpacing: "-0.5px",
                }}
              >
                {globalStats.members}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#4b5563",
                }}
              >
                Membros
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
