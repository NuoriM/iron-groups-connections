export default function ConnectionListComponent({ title, nodes, emptyMsg }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#888",
          marginBottom: "8px",
        }}
      >
        {title}
      </p>
      {nodes.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {nodes.map((node, index) => (
            <li
              key={index}
              style={{ padding: "5px 0", borderBottom: "1px solid #ffffff07" }}
            >
              {node.label || node.id}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: "13px", color: "#aaa", fontStyle: "italic" }}>
          {emptyMsg}
        </p>
      )}
    </div>
  );
};