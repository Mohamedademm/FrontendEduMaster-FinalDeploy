import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RoadmapSelector = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/scraped-data")
      .then(response => response.json())
      .then(data => {
        setRoadmaps(data);
      })
      .catch(error => console.error("Erreur de chargement des données", error));
  }, []);

  const handleSelectionChange = (event) => {
    setSelectedTitle(event.target.value);
  };

  const handleViewRoadmap = () => {
    if (selectedTitle) {
      navigate(`/roadmap/${selectedTitle}`);
    }
  };

  return (
    <div>
      <h1>Sélectionnez un Roadmap</h1>
      <select value={selectedTitle} onChange={handleSelectionChange}>
        <option value="">-- Sélectionnez un Roadmap --</option>
        {roadmaps.map(roadmap => (
          <option key={roadmap.id} value={roadmap.id}>
            {roadmap.title}
          </option>
        ))}
      </select>
      <button onClick={handleViewRoadmap} disabled={!selectedTitle}>
        Voir le Roadmap
      </button>
    </div>
  );
};

export default RoadmapSelector;
