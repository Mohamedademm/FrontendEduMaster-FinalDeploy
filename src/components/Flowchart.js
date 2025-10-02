import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const Flowchart = ({ data }) => {
  const columns = 6;         // 6 boxes par ligne
  const spacingX = 300;        // Espace horizontal entre les boxes
  const spacingY = 200;        // Espace vertical entre les lignes

  // Création des nœuds en grille
  const nodes = data.map((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    return {
      id: `${index}`,
      data: { 
        label: (
          <div style={{ padding: 10, textAlign: "center" }}>
            <h3 style={{ margin: "0 0 5px" }}>{item.title}</h3>
            {item.description && (
              <p style={{ fontSize: "0.9rem", margin: 0 }}>{item.description}</p>
            )}
          </div>
        )
      },
      position: { x: col * spacingX, y: row * spacingY },
      style: {
        width: 280,
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 5,
        background: "#fff"
      }
    };
  });

  // Optionnel : Créer des arêtes reliant les boxes de la même ligne
  const edges = [];
  data.forEach((_, index) => {
    if ((index % columns) < (columns - 1)) {
      edges.push({
        id: `e${index}-${index + 1}`,
        source: `${index}`,
        target: `${index + 1}`,
        style: { stroke: "#888", strokeWidth: 1 }
      });
    }
  });

  const onNodeClick = (event, node) => {
    alert(`Vous avez cliqué sur : ${node.data.label}`);
  };

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView>
        <MiniMap nodeStrokeColor={() => "#888"} nodeColor={() => "#fff"} />
        <Controls />
        <Background gap={16} color="#eee" />
      </ReactFlow>
    </div>
  );
};

export default Flowchart;
