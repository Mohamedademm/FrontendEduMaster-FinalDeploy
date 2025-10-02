import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import { useNavigate } from "react-router-dom";
import "../Css/SearchPage.css";

const RoadmapIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [creating, setCreating] = useState(false); // Add state for roadmap creation
  // Removed isAdmin state, use only userRole
  const [userRole, setUserRole] = useState(""); // State to store user role
  const containerRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const cleanup = initializeBackground(containerRef, mousePosition);
    return cleanup;
  }, []);

  // Update the useEffect to fetch the user's role from localStorage or backend
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is stored in localStorage
        if (user && user.role) {
          setUserRole(user.role);
        } else {
          setUserRole("");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("");
      }
    };

    fetchUserRole();
  }, []);

  const fetchSuggestions = async (query) => {
    setLoading(true); // Start loading
    setError(null); // Reset error
    try {
      const res = await fetch("http://localhost:3000/api/roadmaps");
      const data = await res.json();
      if (data.success) {
        const filteredRoadmaps = data.roadmaps.filter((roadmap) =>
          roadmap.id.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filteredRoadmaps);
      } else {
        setError("Failed to fetch roadmaps.");
      }
    } catch (err) {
      setError("An error occurred while fetching roadmaps.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/RoadmapTitle/${searchQuery}`);
  };

  const handleSuggestionClick = (searchQuery) => {
    setSearchQuery(searchQuery);
    setSuggestions([]);
    navigate(`/RoadmapTitle/${searchQuery}`);
  };

  const handleBrowseLibrary = () => {
    navigate("/RoadmapVisualizer");
  };

  const handleCreateRoadmapWithAI = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a roadmap name.");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      console.log("Sending request to Gemini API with prompt:", searchQuery); // Debugging log

      // Step 1: Send the prompt to the Gemini API
      const geminiResponse = await fetch("http://localhost:3000/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Create a structured, detailed roadmap in JSON format for learning ${searchQuery}. Include a unique ID, title, description, associated icon, color, difficulty, estimated hours, and a list of topics. Each topic should contain: ID, title, description, order of appearance, and optional dependencies. The roadmap should include sections for content (explaining key concepts in Markdown), and resources (with title, URL, and type). The roadmap should follow a logical progression from foundational concepts to advanced topics.`,
        }),
      });

      const geminiData = await geminiResponse.json();
      console.log("Response from Gemini API:", geminiData); // Debugging log

      if (!geminiResponse.ok) {
        throw new Error(geminiData.error || "Failed to generate roadmap.");
      }

      // Step 2: Parse and clean the Gemini API response
      const rawReply = geminiData.response;
      const cleanedReply = parseGeminiResponse(rawReply);
      console.log("Cleaned roadmap data:", cleanedReply); // Debugging log

      // Step 3: Validate required fields
      if (!cleanedReply.id || !cleanedReply.title || !cleanedReply.description) {
        throw new Error("The cleaned roadmap data is missing required fields.");
      }

      // Step 4: Use the cleaned response to create a new roadmap
      const createResponse = await fetch("http://localhost:3000/api/roadmaps/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedReply),
      });

      const createData = await createResponse.json();
      console.log("Response from Create Roadmap API:", createData); // Debugging log

      if (!createResponse.ok) {
        throw new Error(createData.error || "Failed to create roadmap.");
      }      // Step 5: Redirect to the newly created roadmap
      if (createData.roadmapId) {
        console.log("Navigating to RoadmapTitle page with ID:", createData.roadmapId); // Debugging log
        navigate(`/RoadmapTitle/${createData.roadmapId}`);
      } else {
        throw new Error("Roadmap ID is undefined. Cannot navigate to RoadmapTitle page.");
      }
    } catch (err) {
      console.error("Error during roadmap creation:", err); // Debugging log
      setError(err.message || "An error occurred while creating the roadmap.");
    } finally {
      setCreating(false);
    }
  };
const parseGeminiResponse = (rawReply) => {
  try {
    // Handle different input types
    let jsonString;
    
    if (typeof rawReply === "string") {
      jsonString = rawReply;
    } else if (typeof rawReply === "object" && rawReply !== null) {
      if (rawReply.response) {
        jsonString = rawReply.response;
      } else {
        jsonString = JSON.stringify(rawReply);
      }
    } else {
      throw new Error(`rawReply must be a string or object, got ${typeof rawReply}`);
    }


    
    // Remove markdown code blocks
    const sanitizedJson = jsonString
      .replace(/```json\s*|```javascript\s*|```\s*/g, "")
      .trim();

    // Handle cases where JSON might be wrapped in other text
    const jsonStart = sanitizedJson.indexOf("{");
    const jsonEnd = sanitizedJson.lastIndexOf("}");
    
    let finalJson = sanitizedJson;
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      finalJson = sanitizedJson.substring(jsonStart, jsonEnd + 1);
    }

    // Validate JSON structure
    if (!finalJson.startsWith("{") || !finalJson.endsWith("}")) {
      throw new Error("Sanitized content does not have valid JSON structure.");
    }

    const parsedData = JSON.parse(finalJson);
    return extractRoadmapData(parsedData);

  } catch (err) {
    console.error("Error parsing Gemini response:", err);
    console.error("Problematic rawReply:", rawReply);
    throw new Error(`Failed to parse the Gemini API response: ${err.message}`);
  }
};

// Helper function to extract roadmap data from parsed JSON
const extractRoadmapData = (parsedData) => {
  const roadmap = parsedData.roadmap || parsedData;

  if (!roadmap) {
    throw new Error("No roadmap data found in the response.");
  }

  // Extract topics
  const topics = (roadmap.topics || []).map((topic, index) => ({
    id: topic.id || topic.title?.toLowerCase().replace(/\s+/g, "-") || `topic-${index + 1}`,
    title: topic.title || `Topic ${index + 1}`,
    description: topic.description || "",
    order: typeof topic.order === 'number' ? topic.order : index + 1,
    dependencies: Array.isArray(topic.dependencies) ? topic.dependencies : [],
  }));

  // Extract resources
  const resourcesSection = roadmap.sections?.find(
    (section) => section.resources || section.type === "resources"
  );
  const resources = resourcesSection?.resources || roadmap.resources || [];

  const cleanedData = {
    id: roadmap.id || roadmap.title?.toLowerCase().replace(/\s+/g, "-") || "untitled-roadmap",
    title: roadmap.title || "Untitled Roadmap",
    description: roadmap.description || "",
    icon: roadmap.icon || "fas fa-map",
    color: roadmap.color || "#3498db",
    difficulty: roadmap.difficulty || "Intermediate",
    estimatedHours: roadmap.estimatedHours || 0,
    topics,
    resources: resources.map((resource, index) => ({
      id: resource.id || `resource-${index}`,
      title: resource.title || "Untitled Resource",
      url: resource.url || "",
      type: resource.type || "link",
      description: resource.description || ""
    }))
  };

      console.log("Cleaned Roadmap Data:", cleanedData);
  return cleanedData;
};
  useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleCreateRoadmap = () => {
    navigate("/CreeRoadmap"); // Navigate to the CreeRoadmap page
  };

  // Add a back button to navigate to the previous page
  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="search-container">
      
      <div className="dark-filter">
        
      </div>
      <div ref={containerRef} className="mesh-background"></div>

      <div className="content">
        
      {/* Adjust the back button's style to match the provided screenshot */}
<button
  className="cursor-pointer duration-200 hover:scale-125 active:scale-100"
  title="Go Back"
  onClick={handleGoBack}
  style={{
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "transparent",
    border: "none",
    padding: "0",
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="50px"
    height="50px"
    viewBox="0 0 24 24"
    className="stroke-blue-300"
    style={{ strokeWidth: "2" }}
  >
    <path
      strokeLinejoin="round"
      strokeLinecap="round"
      d="M11 6L5 12M5 12L11 18M5 12H19"
    ></path>
  </svg>
</button>

      {(userRole === "admin" || userRole === "teacher") && (
          <button
            type="button"
            className="library-button create-roadmap-button"
            onClick={handleCreateRoadmap}
          >
            Create a New Roadmap
          </button>
        )}
      {(userRole === "user" || userRole === "teacher") && (
        <button
          type="button"
          className="library-button create-roadmap-button"
          onClick={() => userRole === "user" ? navigate("/") : navigate("/HomeTeacher")}
        >
          Home
        </button>
      )}

        <h1 className="title">all world in a prompt</h1>

        <form onSubmit={handleSearch} className="search-formRoadmapIndex">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your search..."
              autoFocus
              key="search-input" // Add this line
            />
            <button
              type="button"
              className="library-button" 
              style={{ width: "35%" }}
              
              onClick={handleBrowseLibrary}
            >
              Browse Our Full Library
            </button>
            <div
          className="outer-cont flex"
          onClick={handleCreateRoadmapWithAI}
          style={{ cursor: creating ? "not-allowed" : "pointer" }}
        >
          <svg
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none">
              <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
              <path
                d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"
                fill="currentColor"
              ></path>
            </g>
          </svg>
          Create Roadmap AI
        </div>
          </div>
          {loading && <p>Loading suggestions...</p>}
          {error && <p className="error-message">{error}</p>}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((roadmap) => (
                <li
                  key={roadmap.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(roadmap.id)}
                >
                  {roadmap.title}
                </li>
              ))}
            </ul>
          )}
          
        </form>

        

        
      </div>
    </div>
  );
};

const initializeBackground = (containerRef, mousePositionRef) => {
  if (!containerRef.current) return;

  const noise3D = createNoise3D();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 20, 30);
  camera.rotation.x = -Math.PI / 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "-1";
  containerRef.current.appendChild(renderer.domElement);

  const particleCount = 6000;
  const gridSize = 100;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * gridSize;
    const z = (Math.random() - 0.5) * gridSize;

    positions[i * 3] = x;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = z;

    sizes[i] = 0.1 + Math.random() * 0.2;

    const intensity = 0.5 + Math.random() * 0.5;
    colors[i * 3] = 0;
    colors[i * 3 + 1] = 0.3 + Math.random() * 0.5;
    colors[i * 3 + 2] = intensity;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.4,
    transparent: true,
    opacity: 0.8,
    vertexColors: true,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x0088ff, 3, 80);
  pointLight.position.set(0, 15, 0);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0x0044ff, 2, 60);
  pointLight2.position.set(-25, 12, 15);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0x00ccff, 2, 60);
  pointLight3.position.set(25, 12, -15);
  scene.add(pointLight3);

  const handleMouseMove = (event) => {
    mousePositionRef.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
  };
  window.addEventListener("mousemove", handleMouseMove);

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", handleResize);

  let time = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    time += 0.005;

    const pos = geometry.attributes.position.array;
    const col = geometry.attributes.color.array;

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const x = pos[ix];
      const z = pos[ix + 2];

      const n = noise3D(x * 0.05, z * 0.05, time);
      const waveY = n * 3;

      const mouseX = mousePositionRef.current.x * 40;
      const mouseZ = -mousePositionRef.current.y * 25;
      const dx = x - mouseX;
      const dz = z - mouseZ;
      const distance = Math.sqrt(dx * dx + dz * dz);

      let mouseEffect = 0;
      if (distance < 25) {
        mouseEffect =
          Math.sin(distance * 0.2 + time * 3) * (1 - distance / 25) * 4;

        const intensity = 1 - distance / 25;
        col[ix] = intensity * 0.4;
        col[ix + 1] = 0.4 + intensity * 0.4;
        col[ix + 2] = 0.8 + intensity * 0.2;
      }

      pos[ix + 1] = waveY + mouseEffect;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    pointLight.intensity = 2.5 + Math.sin(time * 2) * 0.5;
    pointLight2.position.x = Math.sin(time * 0.3) * 25;
    pointLight3.position.z = Math.cos(time * 0.4) * 25;

    particles.rotation.y += 0.0005;

    camera.position.x +=
      (mousePositionRef.current.x * 8 - camera.position.x) * 0.05;
    camera.position.z +=
      (30 + mousePositionRef.current.y * 5 - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };
  animate();

  // Return cleanup function
  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", handleResize);
    if (
      containerRef.current &&
      containerRef.current.contains(renderer.domElement)
    ) {
      containerRef.current.removeChild(renderer.domElement);
    }
    renderer.dispose();
    geometry.dispose();
    material.dispose();
    scene.clear();
  };
};
export default RoadmapIndex;
