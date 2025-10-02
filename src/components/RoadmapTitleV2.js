import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useParams, useNavigate } from "react-router-dom";

const RoadmapTitle = () => {
  const { id } = useParams(); // Extract 'id' from the URL
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Fetch roadmap data by id
  const fetchRoadmap = useCallback(async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error
    try {
      if (!id) {
        setError("Invalid roadmap ID.");
        return;
      }

      console.log("Fetching roadmap with id:", id); // Debugging log
      const res = await fetch(`http://localhost:3000/api/roadmaps/${id}`);
      const data = await res.json();
      console.log("API response:", data); // Debugging log

      if (data.success) {
        const visualData = data.roadmap.visualData;
        setRoadmap(data.roadmap);

        if (visualData) {
          // Map nodes from visualData
          const mappedNodes = visualData.nodes.map((node) => ({
            id: node.id,
            data: { label: node.title },
            position: { x: node.x, y: node.y },
            style: {
              backgroundColor: "#3B82F6",
              color: "#fff",
              borderRadius: 6,
              padding: "10px",
              textAlign: "center",
            },
          }));

          // Map connections from visualData
          const mappedEdges = visualData.connections.map((connection, index) => ({
            id: `e-${connection.source}-${connection.target}-${index}`,
            source: connection.source,
            target: connection.target,
            type: connection.isDependency ? "step" : "smoothstep",
            animated: connection.isDependency,
          }));

          setNodes(mappedNodes);
          setEdges(mappedEdges);
        } else {
          setError("No visual data available for this roadmap.");
        }
      } else {
        setError("Roadmap not found.");
      }
    } catch (err) {
      setError("An error occurred while fetching the roadmap.");
    } finally {
      setLoading(false); // Stop loading
    }
  }, [id]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  if (loading) return <p>Loading roadmap...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!roadmap) return <p>Loading roadmap...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ padding: "20px", backgroundColor: "#111827", color: "#fff" }}>
        <h1>{roadmap.title}</h1>
        <p>{roadmap.description}</p>
        <p>
          <strong>Difficulty:</strong> {roadmap.difficulty}
        </p>
        <p>
          <strong>Estimated Hours:</strong> {roadmap.estimatedHours}
        </p>
      </div>
      <div style={{ flex: 1, backgroundColor: "#f9fafb" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background color="#ddd" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => (node.id === "root" ? "#EF4444" : "#3B82F6")}
          />
        </ReactFlow>
      </div>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#3B82F6',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/courses')}
        >
          Let's Start Learning
        </button>
      </div>
      
    </div>
  );
};

export default RoadmapTitle;
