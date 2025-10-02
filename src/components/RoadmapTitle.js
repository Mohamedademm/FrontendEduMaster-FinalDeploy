import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import { useParams, useNavigate } from "react-router-dom";
import { nodeTypes, nodeStyles, createNode, createEdge, generateExampleMLEngineerData } from "../data/roadmapData";

const RoadmapTitle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [legendVisible, setLegendVisible] = useState(true);
  const [useExampleData, setUseExampleData] = useState(false); // Pour alterner entre données API et exemple

  // Add state for admin role and modal visibility
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", description: "" });

  // Check if the user is an admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  // Update the processRoadmapData function to arrange nodes in a grid layout
  const processRoadmapData = useCallback((roadmapData) => {
    if (!roadmapData || !roadmapData.visualData) return { nodes: [], edges: [] };

    const { nodes: apiNodes } = roadmapData.visualData;

    // Define initial positions for grid layout
    const xStart = 100; // Starting x position
    const yStart = 100; // Starting y position
    const xGap = 270; // Horizontal gap between nodes
    const yGap = 150; // Vertical gap between rows
    const maxTopicsPerRow = 3; // Maximum number of topics per row

    // Transform API nodes into ReactFlow nodes with grid positioning
    const transformedNodes = apiNodes.map((node, index) => {
      const row = Math.floor(index / maxTopicsPerRow); // Determine the row number
      const col = index % maxTopicsPerRow; // Determine the column number

      return createNode(
        node.id,
        node.title,
        xStart + col * xGap, // Horizontal position based on column
        yStart + row * yGap, // Vertical position based on row
        node.type || nodeTypes.DEFAULT, // Default to a generic type if not provided
        {
          description: node.description || "No description available."
        }
      );
    });

    // Create edges to connect each node to the next one in sequence
    const transformedEdges = apiNodes.slice(0, -1).map((node, index) => {
      return createEdge(node.id, apiNodes[index + 1].id, false, "", "smoothstep");
    });

    return { nodes: transformedNodes, edges: transformedEdges };
  }, []);

  // Ensure the fetchRoadmap function processes the data correctly
  const fetchRoadmap = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Utiliser les données d'exemple si demandé ou si aucun ID n'est fourni
      if (useExampleData || !id) {
        console.log("Using example ML Engineer data");
        const exampleData = generateExampleMLEngineerData();
        setRoadmap({
          title: "ML Engineer Learning Path",
          description: "A comprehensive roadmap to become a Machine Learning Engineer",
          difficulty: "Advanced",
          estimatedHours: 1200,
          visualData: {
            nodes: exampleData.nodes,
            connections: exampleData.edges
          }
        });
        setNodes(exampleData.nodes);
        setEdges(exampleData.edges);
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Invalid roadmap ID.");
        return;
      }

      console.log("Fetching roadmap with id:", id);
      const res = await fetch(`http://localhost:3000/api/roadmaps/${id}`);
      const data = await res.json();

      if (data.success) {
        setRoadmap(data.roadmap);

        // Process the roadmap data for visualization
        if (data.roadmap.visualData) {
          const { nodes: processedNodes, edges: processedEdges } = processRoadmapData(data.roadmap);
          setNodes(processedNodes);
          setEdges(processedEdges);
        } else {
          setError("No visual data available for this roadmap.");
        }
      } else {
        setError("Roadmap not found.");
      }
    } catch (err) {
      console.error("Error fetching roadmap:", err);
      setError("An error occurred while fetching the roadmap.");
    } finally {
      setLoading(false);
    }
  }, [id, processRoadmapData, useExampleData]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  // Fonction pour basculer entre les données API et les données d'exemple
  const toggleDataSource = () => {
    setUseExampleData(!useExampleData);
  };

  // Update the showTopicDetails function to include content, dependencies, resources, and subtopics
  const showTopicDetails = (topic) => {
    const modalContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #3B82F6;">${topic.title}</h2>
        <p style="font-size: 14px; color: #555;">${topic.description}</p>
        <div style="margin-top: 20px;">
          <h3 style="font-size: 16px; color: #111;">Content</h3>
          <p style="font-size: 14px; color: #333;">${topic.content || "No content available."}</p>
        </div>
        <div style="margin-top: 20px;">
          <h3 style="font-size: 16px; color: #111;">Dependencies</h3>
          <ul style="font-size: 14px; color: #333;">
            ${
              Array.isArray(topic.dependencies) && topic.dependencies.length > 0
                ? topic.dependencies.map(dep => `<li>${dep}</li>`).join('')
                : '<li>No dependencies available.</li>'
            }
          </ul>
        </div>
        <div style="margin-top: 20px;">
          <h3 style="font-size: 16px; color: #111;">Resources</h3>
          <ul style="font-size: 14px; color: #333;">
            ${
              Array.isArray(topic.resources) && topic.resources.length > 0
                ? topic.resources.map(resource => `<li><a href="${resource.url}" target="_blank" style="color: #3B82F6;">${resource.title}</a> (${resource.type})</li>`).join('')
                : '<li>No resources available.</li>'
            }
          </ul>
        </div>
        <div style="margin-top: 20px;">
          <h3 style="font-size: 16px; color: #111;">Subtopics</h3>
          <ul style="font-size: 14px; color: #333;">
            ${
              Array.isArray(topic.subtopics) && topic.subtopics.length > 0
                ? topic.subtopics.map(subtopic => `<li>${subtopic}</li>`).join('')
                : '<li>No subtopics available.</li>'
            }
          </ul>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#fff';
    modal.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    modal.style.borderRadius = '8px';
    modal.style.zIndex = '1000';
    modal.style.overflow = 'hidden';

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';

    modal.innerHTML = modalContent;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    });

    modal.appendChild(closeButton);
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
  };

  // Update the onNodeClick function to handle topic details for non-admin users
  const onNodeClick = (event, node) => {
    console.log("Node clicked:", node);

    if (!roadmap || !roadmap.topics) {
      alert("Roadmap data is not available.");
      return;
    }

    // Find the topic in the roadmap's topics array
    const topic = roadmap.topics.find((t) => t.id === node.id);

    if (topic) {
      // For non-admin users, show topic details in a modal
      if (!isAdmin) {
        showTopicDetails(topic); // Pass the full topic details to the modal
      } else {
        // For admin users, allow editing the topic
        setSelectedNode({ 
          ...node, 
          data: { 
            ...node.data, 
            description: topic.description || "No description available." 
          } 
        });
        setShowModal(true);
      }
    } else {
      alert("Topic details not found.");
    }
  };

  // Ensure selectedNode is not null before accessing its properties
  const handleSaveNode = () => {
    if (!selectedNode || !selectedNode.data) {
      alert("No node selected for editing.");
      return;
    }

    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                label: selectedNode.data.label || "Untitled",
                description: selectedNode.data.description || "No description available.",
                content: selectedNode.data.content || "No content available.",
                order: selectedNode.data.order || 0,
                dependencies: selectedNode.data.dependencies || [],
                resources: selectedNode.data.resources || [],
                subtopics: selectedNode.data.subtopics || []
              }
            }
          : n
      )
    );

    setRoadmap((prevRoadmap) => ({
      ...prevRoadmap,
      topics: prevRoadmap.topics.map((topic) =>
        topic.id === selectedNode.id
          ? {
              ...topic,
              title: selectedNode.data.label || "Untitled",
              description: selectedNode.data.description || "No description available.",
              content: selectedNode.data.content || "No content available.",
              order: selectedNode.data.order || 0,
              dependencies: selectedNode.data.dependencies || [],
              resources: selectedNode.data.resources || [],
              subtopics: selectedNode.data.subtopics || []
            }
          : topic
      ),
    }));

    setShowModal(false);
  };
  

  // Add a new topic
  const handleAddTopic = () => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      data: { label: newTopic.title },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: { backgroundColor: "#84cc16", color: "#fff" },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setNewTopic({ title: "", description: "" });
  };

  const createCoursesFromRoadmap = async () => {
    if (!roadmap || !roadmap.visualData || !roadmap.visualData.nodes) {
      alert("No roadmap data available to create courses.");
      return;
    }

    const topics = roadmap.visualData.nodes.map((node) => ({
      id: node.id,
      title: node.data?.label || "Untitled Topic", // Use a fallback title if label is missing
      description: node.data?.description || "No description available.", // Use a fallback description if missing
    }));

    try {
      for (const topic of topics) {
        // Generate course details using the Gemini API
        const geminiResponse = await fetch("http://localhost:3000/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Generate a detailed course outline for the topic: "${topic.title}". Include an introduction, key learning objectives, and a summary.`,
          }),
        });

        const geminiData = await geminiResponse.json();
        const courseContent = geminiData.reply || "No content generated.";

        // Create the course in the backend
        const courseResponse = await fetch("http://localhost:3000/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: topic.title,
            domaine: "Roadmap Topic",
            NbMicroCour: 1,
            teacher: "67bd16442d05ce6e9ad0cc75", // Replace with actual teacher ID
            isPremium: false,
            price: 0,
            description: topic.description,
            content: courseContent,
            image: "https://via.placeholder.com/150", // Default placeholder image
          }),
        });

        const courseData = await courseResponse.json();
        console.log(`Course created for topic "${topic.title}":`, courseData);
      }

      alert("Courses created successfully for all topics!");
    } catch (error) {
      console.error("Error creating courses:", error);
      alert("An error occurred while creating courses.");
    }
  };

  if (loading) return <div className="loading-spinner">Loading roadmap...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!roadmap) return <div className="loading-spinner">Loading roadmap...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* En-tête avec informations de la roadmap */}
      <div style={{ 
        padding: "20px", 
        backgroundColor: "#111827", 
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "28px" }}>{roadmap.title}</h1>
          <p style={{ margin: "0 0 5px 0" }}>{roadmap.description}</p>
          <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
            <p style={{ margin: 0 }}>
              <strong>Difficulty:</strong> {roadmap.difficulty}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Estimated Hours:</strong> {roadmap.estimatedHours}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            style={{
              padding: '8px 15px',
              backgroundColor: '#4B5563',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={toggleDataSource}
          >
            {useExampleData ? "Use API Data" : "Show Example ML Engineer Data"}
          </button>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#3B82F6',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onClick={createCoursesFromRoadmap}
          >
            create courses from roadmap
          </button>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#10B981',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                console.log('Token:', token);
                console.log('Roadmap ID:', id);
                if (!token) {
                  alert('You must be logged in to start learning.');
                  return;
                }
                const response = await fetch('http://localhost:3000/api/users/add-roadmap', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ roadmapId: id })
                });
                const data = await response.json();
                console.log('Response from add-roadmap:', data);
                if (response.ok) {
                  alert('Roadmap added to your active roadmaps!');
                  navigate('/'); // Navigate to home page
                } else {
                  alert(data.message || 'Failed to add roadmap.');
                }
              } catch (error) {
                console.error('Error adding roadmap:', error);
                alert('An error occurred while adding the roadmap.');
              }
            }}
          >
            Start Learning
          </button>
        </div>
      </div>

      {/* Zone principale de la visualisation */}
      <div style={{ flex: 1, backgroundColor: "#f9fafb", position: "relative" }}>
        <div style={{ width: '100%', height: '100%' }}> {/* Ensure parent container has width and height */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            minZoom={0.1}
            maxZoom={1.5} // Removed defaultZoom
            attributionPosition="bottom-right"
          >
            <Background color="#ddd" gap={16} size={1} />
            <Controls 
              position="bottom-right"
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            />
            <MiniMap
              nodeColor={(node) => {
                const nodeData = node.data || {};
                const nodeType = nodeData.type || "default";

                switch (nodeType) {
                  case "main":
                    return "#3B82F6";
                  case "category":
                    return "#f97316";
                  case "subcategory":
                    return "#84cc16";
                  case "recommendation":
                    return "#FFEB3B";
                  case "possibility":
                    return "#fff";
                  case "skill":
                    return "#e0f2fe";
                  default:
                    return "#f0f0f0";
                }
              }}
              style={{ backgroundColor: "#f0f0f0" }}
            />
            
            {/* Légende pour les types de nœuds */}
            {legendVisible && (
              <Panel position="top-right" style={{ 
                backgroundColor: 'white', 
                padding: '10px', 
                borderRadius: '5px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                marginRight: '10px',
                marginTop: '10px'
              }}>
                <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Légende</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: nodeStyles[nodeTypes.RECOMMENDATION].backgroundColor,
                      border: nodeStyles[nodeTypes.RECOMMENDATION].border
                    }}></div>
                    <span style={{ fontSize: '12px' }}>Personal Recommendation</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: nodeStyles[nodeTypes.POSSIBILITY].backgroundColor,
                      border: nodeStyles[nodeTypes.POSSIBILITY].border
                    }}></div>
                    <span style={{ fontSize: '12px' }}>Possibilities</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: nodeStyles[nodeTypes.MAIN].backgroundColor
                    }}></div>
                    <span style={{ fontSize: '12px' }}>Main Topic</span>
                  </div>
                </div>
                <button 
                  onClick={() => setLegendVisible(false)}
                  style={{ 
                    fontSize: '10px', 
                    marginTop: '5px', 
                    padding: '2px 5px',
                    backgroundColor: '#f0f0f0',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Hide
                </button>
              </Panel>
            )}
            
            {/* Bouton pour afficher la légende si elle est cachée */}
            {!legendVisible && (
              <Panel position="top-right">
                <button 
                  onClick={() => setLegendVisible(true)}
                  style={{ 
                    fontSize: '12px', 
                    padding: '5px 10px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Show Legend
                </button>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>

      {/* Admin specific actions */}
      {isAdmin && (
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#3B82F6",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => setShowModal(true)}
          >
            Add New Topic
          </button>
        </div>
      )}

      {/* Modal for editing node (updated to include description editing) */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "25%", // Adjusted to align with the top of the screen
            left: "0%", // Move the modal to the left side of the screen
            width: "30%", // Set a fixed width for the modal
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflowY: "auto", // Add scroll for overflow content
            maxHeight: "70%", // Limit the height of the modal
          }}
        >
          <h3>Edit Topic</h3>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>ID:</label>
            <input
              type="text"
              value={selectedNode?.id || ""}
              disabled
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Title:</label>
            <input
              type="text"
              value={selectedNode?.data?.label || ""}
              onChange={(e) =>
                setSelectedNode((prev) => ({
                  ...prev,
                  data: { ...prev.data, label: e.target.value },
                }))
              }
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Description:</label>
            <textarea
              value={selectedNode?.data?.description || ""}
              onChange={(e) =>
                setSelectedNode((prev) => ({
                  ...prev,
                  data: { ...prev.data, description: e.target.value },
                }))
              }
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Content:</label>
            <textarea
              value={selectedNode?.data?.content || ""}
              onChange={(e) =>
                setSelectedNode((prev) => ({
                  ...prev,
                  data: { ...prev.data, content: e.target.value },
                }))
              }
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Order:</label>
            <input
              type="number"
              value={selectedNode?.data?.order || 0}
              onChange={(e) =>
                setSelectedNode((prev) => ({
                  ...prev,
                  data: { ...prev.data, order: parseInt(e.target.value, 10) },
                }))
              }
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Dependencies:</label>
            <textarea
              value={selectedNode?.data?.dependencies?.join(", ") || ""}
              onChange={(e) =>
                setSelectedNode((prev) => ({
                  ...prev,
                  data: { ...prev.data, dependencies: e.target.value.split(",").map((dep) => dep.trim()) },
                }))
              }
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "50px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Resources:</label>
            <textarea
              value={JSON.stringify(selectedNode?.data?.resources || [], null, 2)}
              onChange={(e) =>
                setSelectedNode((prev) => ({
                  ...prev,
                  data: { ...prev.data, resources: JSON.parse(e.target.value) },
                }))
              }
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Subtopics:</label>
            <textarea
              value={selectedNode?.data?.subtopics?.join(", ") || ""}
              onChange={(e) =>
                setSelectedNode((prev) => ({
                  ...prev,
                  data: { ...prev.data, subtopics: e.target.value.split(",").map((sub) => sub.trim()) },
                }))
              }
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "50px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={handleSaveNode}
              style={{
                padding: "10px 20px",
                backgroundColor: "#3B82F6",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapTitle;