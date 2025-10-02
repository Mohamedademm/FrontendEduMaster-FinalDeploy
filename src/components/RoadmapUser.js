import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { createEdge} from "../data/roadmapData";
import { useNavigate } from "react-router-dom";

const RoadmapUser = ({ activeRoadmapId = "angular-learning-roadmap" }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false); // Fixed duplicate declaration
  const [error, setError] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [nextTopicId, setNextTopicId] = useState(null);

  const navigate = useNavigate();

  const fetchUserCompletedCourses = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/career", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCompletedCourses(data.completedCourses.map(c => c.course._id));
      } else {
        console.error("Failed to fetch user completed courses:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user completed courses:", error);
    }
  }, []);

  const findNextTopic = (topics, completed) => {
    if (!topics || topics.length === 0) return null;

    // Sort topics by order ascending
    const sortedTopics = [...topics].sort((a, b) => a.order - b.order);

    // Find highest order of completed topics
    let highestCompletedOrder = -1;
    for (const topic of sortedTopics) {
      if (completed.includes(topic.id)) {
        if (topic.order > highestCompletedOrder) {
          highestCompletedOrder = topic.order;
        }
      }
    }

    // Find the next topic with order greater than highestCompletedOrder
    for (const topic of sortedTopics) {
      if (topic.order > highestCompletedOrder) {
        return topic.id;
      }
    }

    return null;
  };

  const processRoadmapData = useCallback((roadmapData) => {
    if (!roadmapData || !roadmapData.visualData) return { nodes: [], edges: [] };

    const { nodes: apiNodes } = roadmapData.visualData;

    // Define grid layout parameters
    const xStart = 100; // Starting x position
    const yStart = 100; // Starting y position
    const xGap = 270; // Horizontal gap between nodes
    const yGap = 150; // Vertical gap between rows
    const maxTopicsPerRow = 3; // Maximum number of topics per row

    // Arrange nodes in a grid layout
    const transformedNodes = apiNodes.map((node, index) => {
      const row = Math.floor(index / maxTopicsPerRow); // Determine the row number
      const col = index % maxTopicsPerRow; // Determine the column number

      // Determine background color based on completion and next topic
      let backgroundColor = "#fff";
      if (completedCourses.includes(node.id)) {
        backgroundColor = "#ffff"; // Green for completed
      } else if (node.id === nextTopicId) {
        backgroundColor = "#FFEB3B"; // Yellow for next topic
      }

      return {
        id: node.id,
        data: { label: node.title, type: node.type },
        position: { x: xStart + col * xGap, y: yStart + row * yGap },
        style: { backgroundColor, padding: "10px", borderRadius: "5px" },
      };
    });

    // Create edges to connect each node to the next one in sequence
    const transformedEdges = apiNodes.slice(0, -1).map((node, index) => {
      return createEdge(node.id, apiNodes[index + 1].id, false, "", "smoothstep");
    });

    return { nodes: transformedNodes, edges: transformedEdges };
  }, [completedCourses, nextTopicId]);

  const fetchRoadmap = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/roadmaps/${activeRoadmapId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setRoadmap(data.roadmap);

        // After setting roadmap, find next topic
        const nextTopic = findNextTopic(data.roadmap.topics, completedCourses);
        setNextTopicId(nextTopic);

        const { nodes: processedNodes, edges: processedEdges } = processRoadmapData(data.roadmap);
        setNodes(processedNodes);
        setEdges(processedEdges);
      } else {
        setError(data.error || "Failed to fetch roadmap data.");
      }
    } catch (err) {
      setError("An error occurred while fetching the roadmap.");
    } finally {
      setLoading(false);
    }
  }, [activeRoadmapId, processRoadmapData, completedCourses]);

  useEffect(() => {
    fetchUserCompletedCourses();
  }, [fetchUserCompletedCourses]);

  useEffect(() => {
    if (roadmap) {
      const nextTopic = findNextTopic(roadmap.topics, completedCourses);
      setNextTopicId(nextTopic);

      const { nodes: processedNodes, edges: processedEdges } = processRoadmapData(roadmap);
      setNodes(processedNodes);
      setEdges(processedEdges);
    }
  }, [completedCourses, roadmap, processRoadmapData]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const handleNodeClick = async (event, node) => {
    const courseName = node.data.label;
    try {
      const response = await fetch("http://localhost:3000/api/courses");
      const courses = await response.json();
      const matchedCourse = courses.find((course) => course.name === courseName);
      if (matchedCourse) {
        localStorage.setItem("courseId", matchedCourse._id);
        navigate("/MicroCours");
      } else {
        alert("Cours non trouvé pour ce sujet.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des cours :", error);
      alert("Erreur lors de la récupération des cours.");
    }
  };

  if (loading) return <div className="loading-spinner">Loading roadmap...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!roadmap) return <div className="loading-spinner">Loading roadmap...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "70vh" ,width:"100%" }}>
      
      {/* Visualization Section */}
      <div style={{ flex: 1, backgroundColor: "#f9fafb", position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          attributionPosition="bottom-right"
        >
          <Background color="#dddff" gap={16} size={2} />
          <Controls
            position="bottom-right"
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          />
         
          
        
         
        </ReactFlow>
      </div>
    </div>
  );
};

export default RoadmapUser;
