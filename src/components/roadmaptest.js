// src/components/roadmaptest.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaJsSquare, FaBook, FaVideo, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import { FaReact, FaPython, FaJava, FaNodeJs, FaDatabase } from 'react-icons/fa';
import { SiTensorflow, SiKubernetes } from 'react-icons/si';
import ReactMarkdown from 'react-markdown';
import * as d3 from 'd3';
import '../Css/roadmaptest.css';

const iconMap = {
  'react': FaReact,
  'javascript': FaJsSquare,
  'python': FaPython,
  'java': FaJava,
  'nodejs': FaNodeJs,
  'database': FaDatabase,
  'tensorflow': SiTensorflow,
  'kubernetes': SiKubernetes,
};

const RoadmapTest = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]); // Add state for all roadmaps
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/roadmaps`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setRoadmaps(data.roadmaps); // Update state with all roadmaps
      } catch (err) {
        setError(`Failed to fetch roadmaps: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []); // Fetch all roadmaps on component mount

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/roadmaps/${id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setRoadmap(data.roadmap);

        if (data.roadmap.topics?.length > 0) {
          const sorted = [...data.roadmap.topics].sort((a, b) => a.order - b.order);
          setActiveTopicId(sorted[0].id);
        }
      } catch (err) {
        setError(`Failed to fetch roadmap: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoadmap();
  }, [id]);

  useEffect(() => {
    if (roadmap?.visualData && svgRef.current) renderVisualization();
  }, [roadmap, svgRef.current]);

  const renderVisualization = () => {
    const { nodes, connections, theme } = roadmap.visualData;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 800 600`);

    const g = svg.append('g');

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    connections.forEach(conn => {
      const src = nodes.find(n => n.id === conn.source);
      const tgt = nodes.find(n => n.id === conn.target);
      if (src && tgt) {
        g.append('line')
          .attr('x1', src.x).attr('y1', src.y)
          .attr('x2', tgt.x).attr('y2', tgt.y)
          .attr('stroke', conn.isDependency ? '#ff7700' : theme.primaryColor)
          .attr('stroke-width', conn.isDependency ? 2 : 1.5)
          .attr('stroke-dasharray', conn.isDependency ? '5,5' : '')
          .attr('marker-end', 'url(#arrowhead)');
      }
    });

    const nodesGroup = g.selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .on('click', (event, d) => {
        if (d.id !== 'root') setActiveTopicId(d.id);
        document.getElementById('topic-content')?.scrollIntoView({ behavior: 'smooth' });
      });

    nodesGroup.append('circle')
      .attr('r', d => d.type === 'root' ? 40 : 30)
      .attr('fill', d =>
        d.type === 'root' ? theme.centerNodeColor :
        d.id === activeTopicId ? theme.accentColor :
        theme.primaryColor)
      .attr('stroke', d => d.id === activeTopicId ? '#ff7700' : 'none')
      .attr('stroke-width', 3);

    nodesGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'root' ? '0em' : '0.3em')
      .attr('fill', theme.textColor)
      .attr('font-size', d => d.type === 'root' ? '14px' : '12px')
      .attr('font-weight', d => d.type === 'root' ? 'bold' : 'normal')
      .each(function(d) {
        const text = d3.select(this);
        const words = d.title.split(/\s+/);
        if (words.length > 2) {
          text.text(words[0]);
          for (let i = 1; i < Math.min(words.length, 3); i++) {
            text.append('tspan').attr('x', 0).attr('dy', '1.2em').text(words[i]);
          }
          if (words.length > 3) {
            text.append('tspan').attr('x', 0).attr('dy', '1.2em').text('...');
          }
        } else {
          text.text(d.title);
        }
      });
  };

  if (loading) return <div className="loading">Loading roadmaps...</div>;
  if (error) return <div className="error">{error}</div>;

  if (!id) {
    return (
      <div className="roadmaps-list">
        <h1>All Roadmaps</h1>
        <ul>
          {roadmaps.map((roadmap) => (
            <li key={roadmap.id}>
              <Link to={`/roadmap/${roadmap.id}`}>{roadmap.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!roadmap) return <div className="error">Roadmap not found</div>;

  const IconComponent = iconMap[roadmap.icon?.toLowerCase()] || FaJsSquare;
  const activeTopic = roadmap.topics.find(t => t.id === activeTopicId);
  const sortedTopics = [...roadmap.topics].sort((a, b) => a.order - b.order);

  return (
    <div className="roadmap-detail">
      <Link to="/roadmaps" className="back-button">
        <FaArrowLeft /> Back to Roadmaps
      </Link>

      <div className="roadmap-header" style={{ backgroundColor: roadmap.color + '20' }}>
        <div className="roadmap-icon large" style={{ backgroundColor: roadmap.color }}>
          <IconComponent size={48} />
        </div>
        <div className="roadmap-info">
          <h1>{roadmap.title}</h1>
          <p className="description">{roadmap.description}</p>
        </div>
      </div>

      <div className="visualization-container">
        <h2>Learning Path Visualization</h2>
        <div className="svg-container">
          <svg ref={svgRef} className="roadmap-visualization"></svg>
        </div>
      </div>

      {activeTopic && (
        <div id="topic-content" className="topic-detail">
          <div className="topic-header">
            <h2>{activeTopic.title}</h2>
          </div>
          <div className="topic-content">
            <ReactMarkdown>{activeTopic.content}</ReactMarkdown>
          </div>

          {activeTopic.resources?.length > 0 && (
            <div className="resources">
              <h3>Learning Resources</h3>
              <ul className="resources-list">
                {activeTopic.resources.map((res, i) => (
                  <li key={i} className={`resource-item ${res.type}`}>
                    <a href={res.url} target="_blank" rel="noopener noreferrer">
                      {res.type === 'documentation' && <FaBook />}
                      {res.type === 'tutorial' && <FaVideo />}
                      {res.type === 'article' && <FaBook />}
                      {!['documentation', 'tutorial', 'article'].includes(res.type) && <FaExternalLinkAlt />}
                      <span>{res.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadmapTest;
