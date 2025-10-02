import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RoadmapDetails = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/roadmaps`);
        const data = await response.json();
        if (data.success) {
          const foundRoadmap = data.roadmaps.find((roadmap) => roadmap.id === id);
          if (foundRoadmap) {
            setRoadmap(foundRoadmap);
          } else {
            setError('Roadmap not found');
          }
        } else {
          setError('Failed to fetch roadmaps');
        }
      } catch (err) {
        setError('An error occurred while fetching the roadmap');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{roadmap.title}</h1>
      <p>{roadmap.description}</p>
      <p><strong>Difficulty:</strong> {roadmap.difficulty}</p>
      <p><strong>Estimated Hours:</strong> {roadmap.estimatedHours}</p>
      <p><strong>Created At:</strong> {new Date(roadmap.createdAt).toLocaleDateString()}</p>
      <p><strong>Updated At:</strong> {new Date(roadmap.updatedAt).toLocaleDateString()}</p>
    </div>
  );
};

export default RoadmapDetails;
