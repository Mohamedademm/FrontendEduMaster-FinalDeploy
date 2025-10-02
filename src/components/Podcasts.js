import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../Css/Podcasts.css';
import { FaSearch, FaSpinner, FaExclamationTriangle, FaExternalLinkAlt, FaMicrophone, FaStar, FaTags, FaCalendarAlt, FaTimesCircle, FaChevronDown, FaBroadcastTower } from 'react-icons/fa';

const PODCASTS_PER_PAGE = 12; // Number of podcasts to show per page/load

const Podcasts = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [displayedPodcasts, setDisplayedPodcasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [popularPodcasts, setPopularPodcasts] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  const fetchPopularPodcasts = useCallback(async (genre = 'education', limit = 6) => {
    setLoadingPopular(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/podcasts/featured/popular?genre=${genre}&limit=${limit}`);
      setPopularPodcasts(response.data.feeds || []);
    } catch (err) {
      console.error(`Error loading popular ${genre} podcasts:`, err);
      // Don't set a user-facing error for popular podcasts, just log it
    } finally {
      setLoadingPopular(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularPodcasts('education', 6); // Load educational podcasts initially
  }, [fetchPopularPodcasts]);

  const searchPodcasts = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search term.");
      setSearchResults([]);
      setDisplayedPodcasts([]);
      setSearched(true);
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    setCurrentPage(1); // Reset to first page on new search
    try {
      const response = await axios.get(`http://localhost:3000/api/podcasts/search?q=${encodeURIComponent(query)}`);
      const allResults = response.data.feeds || [];
      setSearchResults(allResults);
      setDisplayedPodcasts(allResults.slice(0, PODCASTS_PER_PAGE));
      if (allResults.length === 0) {
        setError("No podcasts found for your search.");
      }
    } catch (err) {
      console.error("Error fetching podcasts:", err.response ? err.response.data : err.message);
      const errorMsg = err.response?.data?.message || 'Error during search. Please try again.';
      setError(errorMsg);
      setSearchResults([]);
      setDisplayedPodcasts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const newDisplayedPodcasts = searchResults.slice(0, nextPage * PODCASTS_PER_PAGE);
    setDisplayedPodcasts(newDisplayedPodcasts);
    setCurrentPage(nextPage);
  };
  
  const handleClearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setDisplayedPodcasts([]);
    setSearched(false);
    setError(null);
    setCurrentPage(1);
    // Optionally, re-fetch popular podcasts if they were hidden by search results
    if (popularPodcasts.length === 0) {
        fetchPopularPodcasts();
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text || typeof text !== 'string') return "No description available.";
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const renderPodcastCard = (podcast, isPopular = false) => (
    <div key={podcast.id || podcast.title} className={`podcast-card ${isPopular ? 'popular-card' : ''}`}>
      {isPopular && <div className="card-badge popular-badge-style"><FaStar /> Popular</div>}
      <div className="card-image-container">
        <img 
          src={podcast.image || '/default-podcast-image.png'} 
          alt={podcast.title} 
          className="card-image"
          onError={(e) => { e.target.src = '/default-podcast-image.png'; }}
        />
      </div>
      <div className="card-content">
        <h3 className="card-title" title={podcast.title}>{truncateText(podcast.title, 60)}</h3>
        <p className="card-author">
          <FaMicrophone size={14} /> By: {truncateText(podcast.author || 'Unknown Author', 30)}
        </p>
        {podcast.category && (
          <p className="card-meta card-category">
            <FaTags size={14} /> Category: {truncateText(podcast.category, 25)}
          </p>
        )}
        {podcast.lastUpdate && (
           <p className="card-meta card-date">
            <FaCalendarAlt size={14} /> {formatDate(podcast.lastUpdate)}
           </p>
        )}
        <p className="card-description">{truncateText(podcast.description, 80)}</p>
        <a 
          href={podcast.link || podcast.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="card-listen-button"
        >
          Listen <FaExternalLinkAlt size={12} />
        </a>
      </div>
    </div>
  );

  return (
    <div className="podcasts-container-modern">
      <header className="podcasts-main-header">
        <div className="header-icon-decorative"><FaBroadcastTower size={40}/></div>
        <h1>Explore the World of Podcasts</h1>
        <p>Find, listen, and discover enriching audio content.</p>
        <form className="modern-search-form" onSubmit={searchPodcasts}>
          <div className="search-input-wrapper">
            <FaSearch className="search-icon-input" />
            <input
              type="text"
              className="modern-search-input"
              placeholder="Search by title, topic, author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" onClick={handleClearSearch} className="clear-search-button" title="Clear search">
                <FaTimesCircle />
              </button>
            )}
          </div>
          <button type="submit" className="modern-search-button" disabled={loading}>
            {loading ? <FaSpinner className="spinner-icon" /> : 'Search'}
          </button>
        </form>
      </header>

      {error && (
        <div className="modern-message modern-error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* Popular Podcasts Section */}
      {!searched && !loading && popularPodcasts.length > 0 && (
        <section className="podcasts-section popular-podcasts-section">
          <h2 className="section-heading"><FaStar /> Popular Podcasts</h2>
          <div className="podcasts-grid">
            {popularPodcasts.map(podcast => renderPodcastCard(podcast, true))}
          </div>
        </section>
      )}
       {loadingPopular && !searched && (
         <div className="modern-message modern-loading-message">
            <FaSpinner className="spinner-icon" /> Loading popular podcasts...
        </div>
       )}


      {/* Search Results Section */}
      {searched && !loading && displayedPodcasts.length > 0 && (
        <section className="podcasts-section search-results-section">
          <h2 className="section-heading">Search Results</h2>
          <div className="podcasts-grid">
            {displayedPodcasts.map(podcast => renderPodcastCard(podcast))}
          </div>
          {displayedPodcasts.length < searchResults.length && (
            <div className="load-more-container">
              <button onClick={handleLoadMore} className="load-more-button" disabled={loading}>
                {loading ? <FaSpinner className="spinner-icon" /> : <>Load More <FaChevronDown /></>}
              </button>
            </div>
          )}
        </section>
      )}
      
      {/* Loading state for search */}
      {loading && searched && (
        <div className="modern-message modern-loading-message">
          <FaSpinner className="spinner-icon" /> Searching for podcasts...
        </div>
      )}

      {/* No results message for search */}
      {!loading && searched && displayedPodcasts.length === 0 && !error && (
         <div className="modern-message modern-no-results-message">
            No podcasts found for "{query}". Try another search term or explore our suggestions.
        </div>
      )}
      
      {/* Initial state or after clearing search with no popular podcasts loaded */}
      {!searched && !loadingPopular && popularPodcasts.length === 0 && !error && (
        <div className="modern-message modern-info-message">
            Use the search bar to find specific podcasts.
        </div>
      )}

    </div>
  );
};

export default Podcasts;
