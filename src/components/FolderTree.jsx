import { useState } from "react";

export default function FolderTree({ tree, onFileClick }) {
  return (
    <div>
      
      <h4 style={{ marginBottom: 12 }}>Project Files</h4>
      {tree.map((node) => (
        <TreeNode
          key={node.path || node.name}
          node={node}
          onFileClick={onFileClick}
          level={0}
        />
      ))}
    </div>
  );
}

function TreeNode({ node, onFileClick, level }) {
  const [open, setOpen] = useState(false); // 🔥 collapsed by default

  if (node.type === "folder") {
    return (
      <div style={{ marginLeft: level * 12 }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
            fontWeight: 600,
            padding: "4px 0",
            userSelect: "none"
          }}
        >
          {open ? "▼" : "▶"} 📁 {node.name}
        </div>

        {open &&
          node.children.map((child) => (
            <TreeNode
              key={child.path || child.name}
              node={child}
              onFileClick={onFileClick}
              level={level + 1}
            />
          ))}
      </div>
    );
  }

  // FILE
  return (
    <div
      style={{
        marginLeft: level * 12 + 16,
        cursor: "pointer",
        padding: "4px 0",
        color: "#2563eb"
      }}
      onClick={() => onFileClick(node.path)}
    >
      📄 {node.name}
    </div>
  );
}
