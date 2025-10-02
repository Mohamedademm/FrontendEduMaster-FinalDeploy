import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import '../Css/RoadmapVisualizer.css';

const nodeWidth = 200;
const nodeHeight = 60;

const RoadmapVisualizer = () => {
  const { t } = useTranslation();
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  const fetchRoadmaps = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/roadmaps");
      const data = await res.json();
      if (data.success) setRoadmaps(data.roadmaps);
    } catch (err) {
      console.error("Error fetching roadmaps:", err);
    }
  }, []);

  const fetchRoadmapDetails = useCallback(async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/roadmaps/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedRoadmap(data.roadmap);

        const { nodes: visualNodes, connections } = data.roadmap.visualData;

        const formattedNodes = visualNodes.map((node) => ({
          id: node.id,
          data: { label: node.title },
          position: { x: node.x, y: node.y },
          style: {
            backgroundColor: node.type === "root" ? "#fbbf24" : "#3b82f6",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: 10,
            width: nodeWidth,
            height: nodeHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          },
        }));

        const formattedEdges = connections.map((connection) => ({
          id: `e-${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          type: connection.isDependency ? "smoothstep" : "default",
          animated: connection.isDependency,
        }));

        setNodes(formattedNodes);
        setEdges(formattedEdges);
      }
    } catch (err) {
      console.error(`Error fetching roadmap '${id}':`, err);
    }
  }, []);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  const onNodeClick = (_, node) => {
    const topic = selectedRoadmap.topics.find((t) => t.id === node.id);
    setSelectedTopic(topic || null);
  };
  const deleteRoadmap = async (id) => {
    if (!window.confirm(t('confirm_delete_roadmap'))) return;

    try {
      const res = await fetch(`http://localhost:3000/api/roadmaps/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete roadmap");

      setRoadmaps((prev) => prev.filter((roadmap) => roadmap.id !== id));
      alert("Roadmap deleted successfully");
    } catch (err) {
      console.error("Error deleting roadmap:", err);
      alert("Failed to delete roadmap");
    }
  };

  const editRoadmap = (roadmap) => {
    navigate(`/EditRoadmap?id=${roadmap.id}`, { state: { roadmap } });
  };

  return (
    <div className="visualizer-container">
      {/* Roadmap List */}
      <div className="sidebar">        <h2>📘 {t('roadmaps')}</h2>
        <ul>
          {roadmaps.map((roadmap) => (
            <li
              key={roadmap.id}
              style={{ backgroundColor: roadmap.color }}
              onClick={() => fetchRoadmapDetails(roadmap.id)}
            >
              <h3>{roadmap.title}</h3>
              <p>{roadmap.description}</p>
              {isAdmin && (
                <div className="admin-actions">
                  <button className="library-button-RoadmapVisualizer" onClick={() => editRoadmap(roadmap)}>{t('edit')}</button>
                  <button className="library-button-RoadmapVisualizer" onClick={() => deleteRoadmap(roadmap.id)}>{t('delete')}</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Roadmap Flow */}
      <div className="flow-panel">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          panOnDrag
          nodesDraggable={false}
          zoomOnScroll
        >
          <Background color="#1f2937" gap={18} />
          <Controls />
          <MiniMap
            nodeColor={(node) => (node.id === "root" ? "#fbbf24" : "#3b82f6")}
            maskColor="rgba(0, 0, 0, 0.2)"
            style={{
              height: 120,
              width: 200,
              backgroundColor: "#111827",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
          />
        </ReactFlow>
      </div>

      {/* Topic Detail */}
      <div className="topic-panel">
        {selectedTopic ? (
          <>
            <h2>{selectedTopic.title}</h2>
            <p>{selectedTopic.description}</p>
            <div dangerouslySetInnerHTML={{ __html: selectedTopic.content }} />            <h4>{t('resources')}</h4>
            <ul className="resources">
              {selectedTopic.resources.map((res, idx) => (
                <li key={idx}>
                  <a href={res.url} target="_blank" rel="noopener noreferrer">
                    🔗 {res.title}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="empty-state">
            <p>⬅️ {t('click_node_view_details')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapVisualizer;
