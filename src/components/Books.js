import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  LayoutList,
  BookOpen,
  ExternalLink,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  User,
  Eye,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import './Books.css';

const Books = () => {
  // États principaux
  const [query, setQuery] = useState('popular books'); // Initialize with a default search term
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [showFilters, setShowFilters] = useState(false);
  const [savedBooks, setSavedBooks] = useState(new Set());
  const [recentSearches, setRecentSearches] = useState([]);

  const [filters, setFilters] = useState({
    author: '',
    publishYear: '',
    subject: '',
    yearRange: { min: '', max: '' },
    hasSubject: false,
    language: ''
  });

  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const pageSize = 12;

  // --- Recherche via API backend
  const searchBooks = useCallback(async (pageNumber = 1, searchTerm) => { // Removed default for searchTerm to make dependencies clearer
    if (!searchTerm || !searchTerm.trim()) { // Ensure searchTerm is provided and not empty
      setBooks([]);
      setTotalPages(1);
      setPage(1);
      return;
    }
    setLoading(true);
    setError(null);
    console.log(`Fetching: /api/books/search?q=${encodeURIComponent(searchTerm)}&page=${pageNumber}&limit=${pageSize}`); 
    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchTerm)}&page=${pageNumber}&limit=${pageSize}`);
      
      if (!response.ok) {
        // Try to get error message from backend if response is not OK
        let errorData;
        try {
          errorData = await response.json(); // Try to parse as JSON first
        } catch (jsonError) {
          // If parsing error data as JSON fails, read as text
          const errorText = await response.text();
          console.error("Non-JSON error response from server (status !ok):", errorText); // More specific log
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        // If errorData was parsed as JSON but might not have a .message
        throw new Error(errorData.message || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
      }

      // Try to parse the successful response as JSON
      const responseText = await response.clone().text(); 
      let data;
      try {
        data = JSON.parse(responseText); 
      } catch (e) {
        console.error("Failed to parse JSON from successful response. Received text:", responseText); // More specific log
        throw new Error("Received non-JSON response from server despite OK status.");
      }

      setBooks(data.docs || []);
      setTotalPages(Math.ceil((data.numFound || 0) / pageSize));
      setPage(data.page || pageNumber);

      // Gérer recherches récentes
      if (searchTerm && !recentSearches.includes(searchTerm)) {
        setRecentSearches(prev => [searchTerm, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      console.error("Search error details:", err);
      setError(err.message || 'Erreur lors de la recherche. Veuillez réessayer.');
      setBooks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [pageSize, recentSearches]); // Removed query from here, it's passed as searchTerm

  useEffect(() => {
    if (query.trim()) {
      searchBooks(1, query); // Pass query explicitly
    } else {
      setBooks([]);
      setTotalPages(1);
      setPage(1);
    }
  }, [query, searchBooks]); // searchBooks is stable due to useCallback, query triggers re-fetch

  // Gestion filtres
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleYearRangeChange = (e, bound) => {
    setFilters(prev => ({
      ...prev,
      yearRange: { ...prev.yearRange, [bound]: e.target.value }
    }));
  };

  // Soumission recherche
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchBooks(1, query);
    }
  };

  // Tri et filtrage local
  const applyFiltersAndSort = (list) => {
    let filtered = list.filter(book => {
      if (filters.author && !book.author_name?.some(a => a.toLowerCase().includes(filters.author.toLowerCase()))) return false;
      if (filters.publishYear && book.first_publish_year?.toString().indexOf(filters.publishYear) !== 0) return false;
      if (filters.subject && !book.subject?.some(s => s.toLowerCase().includes(filters.subject.toLowerCase()))) return false;
      if (filters.yearRange.min && book.first_publish_year < Number(filters.yearRange.min)) return false;
      if (filters.yearRange.max && book.first_publish_year > Number(filters.yearRange.max)) return false;
      if (filters.hasSubject && (!book.subject || book.subject.length === 0)) return false;
      // Adjusted language filter for API returning an array of language codes
      if (filters.language && !(book.language && book.language.includes(filters.language))) return false;
      return true;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'first_publish_year' || sortConfig.key === 'ratings_average') {
          valA = parseFloat(valA) || 0;
          valB = parseFloat(valB) || 0;
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (Array.isArray(valA)) valA = valA[0]?.toLowerCase() || '';
        if (Array.isArray(valB)) valB = valB[0]?.toLowerCase() || '';

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredAndSortedBooks = useMemo(() => applyFiltersAndSort(books), [books, filters, sortConfig]);

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      searchBooks(newPage, query);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Gestion tri
  const requestSort = (key) => {
    const direction = (sortConfig.key === key && sortConfig.direction === 'ascending') ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
  };

  // Favoris (bookmark)
  const toggleBookmark = (bookKey) => {
    setSavedBooks(prev => {
      const next = new Set(prev);
      if (next.has(bookKey)) next.delete(bookKey);
      else next.add(bookKey);
      return next;
    });
  };

  // URL couverture
  const getBookCoverUrl = (book) => book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : 'https://via.placeholder.com/200x300/e2e8f0/64748b?text=Pas+de+Couverture';

  // Effacer filtres
  const clearFilters = () => {
    setFilters({
      author: '',
      publishYear: '',
      subject: '',
      yearRange: { min: '', max: '' },
      hasSubject: false,
      language: ''
    });
  };

  // Affichage étoiles de notation
  const getRatingStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      else if (i === full && half) stars.push(<Star key={`half-${i}`} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
      else stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  // Pagination boutons limités à max 5 pages visibles
  const renderPaginationButtons = () => {
    const buttons = [];
    if (totalPages <= 1) return null;

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end === totalPages && end - start + 1 < Math.min(5, totalPages)) {
      start = Math.max(1, end - Math.min(5, totalPages) + 1);
    }
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={page === i ? 'active' : ''}
          aria-current={page === i ? 'page' : undefined}
          aria-label={`Page ${i}`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="books-page" role="main" aria-label="Bibliothèque digitale">
      <header className="books-header">
        <h1>
          <BookOpen className="inline-block mr-3 align-middle" size={40} aria-hidden="true" />
          Bibliothèque Digitale
        </h1>

        <form onSubmit={handleSearchSubmit} className="search-form" role="search" aria-label="Recherche de livres">
          <div className="search-input-container">
            <Search className="search-input-icon" aria-hidden="true" />
            <input
              type="search"
              aria-label="Rechercher des livres par titre, auteur ou sujet"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher par titre, auteur, sujet..."
              className="search-input"
              autoComplete="off"
              spellCheck={false}
              required
            />
          </div>

          <button type="submit" className="search-button" aria-live="polite" aria-busy={loading}>
            Rechercher
          </button>

          <button
            type="button"
            onClick={() => setShowFilters(f => !f)}
            className="filter-toggle-button"
            aria-expanded={showFilters}
            aria-controls="filters-section"
          >
            <Filter className="w-5 h-5" aria-hidden="true" />
            <span>Filtres</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </form>

        {recentSearches.length > 0 && (
          <section className="recent-searches-container" aria-label="Recherches récentes">
            <p className="recent-searches-title">Recherches récentes :</p>
            <div className="recent-searches-tags">
              {recentSearches.map((term, i) => (
                <button
                  key={term + i}
                  onClick={() => { setQuery(term); searchBooks(1, term); }}
                  className="recent-search-tag"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>
        )}
      </header>

      <div className="books-container">
        {showFilters && (
          <aside
            className="filters-sidebar"
            id="filters-section"
            aria-label="Filtres de recherche et tri"
            tabIndex={-1}
          >
            <div className="filters-sidebar-header">
              <h2>Filtres & Tri</h2>
              <button onClick={clearFilters} className="clear-filters-button" aria-label="Effacer tous les filtres">
                Effacer tout
              </button>
            </div>

            <div className="filter-group">
              <label htmlFor="author-filter">Auteur</label>
              <input
                id="author-filter"
                name="author"
                type="text"
                placeholder="ex: J.K. Rowling"
                value={filters.author}
                onChange={handleInputChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="publishYear-filter">Année de publication</label>
              <input
                id="publishYear-filter"
                name="publishYear"
                type="number"
                placeholder="ex: 1997"
                value={filters.publishYear}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="filter-group">
              <label>Plage d'années</label>
              <div className="year-range-inputs">
                <input
                  type="number"
                  aria-label="Année minimum"
                  placeholder="De"
                  value={filters.yearRange.min}
                  onChange={e => handleYearRangeChange(e, 'min')}
                  min="0"
                />
                <input
                  type="number"
                  aria-label="Année maximum"
                  placeholder="À"
                  value={filters.yearRange.max}
                  onChange={e => handleYearRangeChange(e, 'max')}
                  min="0"
                />
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="subject-filter">Sujet</label>
              <input
                id="subject-filter"
                name="subject"
                type="text"
                placeholder="ex: Fantasy, Science"
                value={filters.subject}
                onChange={handleInputChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="language-filter">Langue</label>
              <select
                id="language-filter"
                name="language"
                value={filters.language}
                onChange={handleInputChange}
              >
                <option value="">Toutes les langues</option>
                <option value="en">Anglais</option>
                <option value="fr">Français</option>
                <option value="es">Espagnol</option>
              </select>
            </div>

            <div className="filter-group filter-checkbox-group">
              <input
                id="hasSubject"
                name="hasSubject"
                type="checkbox"
                checked={filters.hasSubject}
                onChange={handleInputChange}
              />
              <label htmlFor="hasSubject">Seulement avec sujets</label>
            </div>

            <div className="sort-group">
              <h3>Trier par</h3>
              <select
                aria-label="Critère de tri"
                value={sortConfig.key}
                onChange={e => requestSort(e.target.value)}
              >
                <option value="title">Titre</option>
                <option value="first_publish_year">Année de publication</option>
                <option value="author_name">Auteur</option>
                <option value="ratings_average">Note moyenne</option>
              </select>
              <button
                onClick={() => requestSort(sortConfig.key)}
                className="sort-direction-button"
                aria-label={`Trier par ordre ${sortConfig.direction === 'ascending' ? 'croissant' : 'décroissant'}`}
              >
                {sortConfig.direction === 'ascending' ? (
                  <>Croissant <ChevronUp className="w-4 h-4 inline-block" /></>
                ) : (
                  <>Décroissant <ChevronDown className="w-4 h-4 inline-block" /></>
                )}
              </button>
            </div>
          </aside>
        )}

        <main className="books-list-area" aria-live="polite" aria-busy={loading}>
          <div className="results-summary" aria-atomic="true">
            {filteredAndSortedBooks.length} livre{filteredAndSortedBooks.length !== 1 ? 's' : ''} trouvé{filteredAndSortedBooks.length !== 1 ? 's' : ''}
            {query && ` pour "${query}"`}
          </div>

          <div className="view-mode-toggle" role="radiogroup" aria-label="Changer la vue">
            <button
              aria-checked={viewMode === 'grid'}
              role="radio"
              onClick={() => setViewMode('grid')}
              className={`toggle-button ${viewMode === 'grid' ? 'active' : ''}`}
              aria-label="Vue grille"
              type="button"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              aria-checked={viewMode === 'list'}
              role="radio"
              onClick={() => setViewMode('list')}
              className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
              aria-label="Vue liste"
              type="button"
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>

          {loading && (
            <div className="loading-spinner-container" role="status" aria-live="polite">
              <div className="loading-spinner" />
              Chargement des livres...
            </div>
          )}

          {error && <div className="error-message" role="alert">{error}</div>}

          {!loading && !error && filteredAndSortedBooks.length === 0 && (
            <div className="no-results" role="alert" aria-live="assertive">
              <BookOpen className="no-results-icon" aria-hidden="true" />
              <p>Aucun livre trouvé</p>
              <p>Essayez d'ajuster vos critères de recherche ou de filtres.</p>
            </div>
          )}

          {!loading && !error && filteredAndSortedBooks.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="books-grid">
                  {filteredAndSortedBooks.map((book, i) => (
                    <article
                      key={book.key || `book-${i}`}
                      tabIndex={0}
                      className="book-card"
                      onClick={() => setSelectedBook(book)}
                      onKeyDown={e => { if (e.key === 'Enter') setSelectedBook(book); }}
                      aria-label={`Afficher les détails du livre ${book.title}`}
                      role="button"
                    >
                      <div className="book-cover-container">
                        <img
                          src={getBookCoverUrl(book)}
                          alt={`Couverture du livre ${book.title}`}
                          className="book-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <button
                          onClick={e => { e.stopPropagation(); toggleBookmark(book.key); }}
                          className={`bookmark-button card-bookmark-button ${savedBooks.has(book.key) ? 'saved' : ''}`}
                          aria-label={savedBooks.has(book.key) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          type="button"
                        >
                          {savedBooks.has(book.key) ? (
                            <BookmarkCheck className="w-5 h-5" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="book-info">
                        <h3 className="book-title" title={book.title}>{book.title}</h3>
                        <p className="book-author"><User className="w-3 h-3 inline-block mr-1 align-middle" />{book.author_name?.join(', ') || 'Auteur inconnu'}</p>
                        <p className="book-year"><Calendar className="w-3 h-3 inline-block mr-1 align-middle" />{book.first_publish_year || 'Année inconnue'}</p>
                        {book.ratings_average && (
                          <div className="book-rating">
                            {getRatingStars(book.ratings_average)}
                            <span className="rating-text">({book.ratings_average.toFixed(1)})</span>
                          </div>
                        )}
                        {book.want_to_read_count && (
                          <div className="book-popularity">
                            <Eye className="w-3 h-3 mr-1 align-middle" />
                            <span>{book.want_to_read_count.toLocaleString()} intéressées</span>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="books-list-view">
                  {filteredAndSortedBooks.map((book, i) => (
                    <article
                      key={book.key || `book-list-${i}`}
                      tabIndex={0}
                      className="book-card list-view-card"
                      onClick={() => setSelectedBook(book)}
                      onKeyDown={e => { if (e.key === 'Enter') setSelectedBook(book); }}
                      aria-label={`Afficher les détails du livre ${book.title}`}
                      role="button"
                    >
                      <div className="book-cover-container list-view-cover">
                        <img
                          src={getBookCoverUrl(book)}
                          alt={`Couverture du livre ${book.title}`}
                          className="book-cover"
                          loading="lazy"
                          decoding="async"
                        />
                         <button // Bookmark button for list view item
                            onClick={e => { e.stopPropagation(); toggleBookmark(book.key); }}
                            className={`bookmark-button list-view-bookmark-button ${savedBooks.has(book.key) ? 'saved' : ''}`}
                            aria-label={savedBooks.has(book.key) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            type="button"
                          >
                            {savedBooks.has(book.key) ? (
                              <BookmarkCheck className="w-5 h-5" />
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </button>
                      </div>
                      <div className="book-info list-view-info">
                        <h3 className="book-title" title={book.title}>{book.title}</h3>
                        <p className="book-author"><User className="w-3 h-3 inline-block mr-1 align-middle" />{book.author_name?.join(', ') || 'Auteur inconnu'}</p>
                        <p className="book-year"><Calendar className="w-3 h-3 inline-block mr-1 align-middle" />{book.first_publish_year || 'Année inconnue'}</p>
                        {book.ratings_average && (
                          <div className="book-rating">
                            {getRatingStars(book.ratings_average)}
                            <span className="rating-text">({book.ratings_average.toFixed(1)})</span>
                          </div>
                        )}
                        {book.want_to_read_count && (
                          <div className="book-popularity">
                            <Eye className="w-3 h-3 mr-1 align-middle" />
                            <span>{book.want_to_read_count.toLocaleString()} intéressées</span>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  className="pagination"
                  role="navigation"
                  aria-label="Pagination des résultats"
                >
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    aria-disabled={page === 1}
                    aria-label="Page précédente"
                  >
                    <ChevronUp className="w-4 h-4 transform -rotate-90" aria-hidden="true" />
                    Précédent
                  </button>
                  <span className="pagination-numbers">{renderPaginationButtons()}</span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    aria-disabled={page === totalPages}
                    aria-label="Page suivante"
                  >
                    Suivant
                    <ChevronUp className="w-4 h-4 transform rotate-90" aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modale détail livre */}
      {selectedBook && (
        <div
          className="book-modal-overlay"
          onClick={() => setSelectedBook(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          <div className="book-modal-content" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedBook(null)}
              className="close-modal-button"
              aria-label="Fermer la fenêtre modale"
              autoFocus
            >
              <X size={28} />
            </button>

            <div className="modal-book-cover-section">
              <img
                src={getBookCoverUrl(selectedBook)}
                alt={`Couverture du livre ${selectedBook.title}`}
                className="modal-book-cover"
              />
              <button
                onClick={() => toggleBookmark(selectedBook.key)}
                className={`bookmark-button modal-bookmark-button ${savedBooks.has(selectedBook.key) ? 'saved' : ''}`}
                aria-label={savedBooks.has(selectedBook.key) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {savedBooks.has(selectedBook.key) ? (
                  <>
                    <BookmarkCheck className="w-5 h-5 mr-2" />
                    Sauvegardé
                  </>
                ) : (
                  <>
                    <Bookmark className="w-5 h-5 mr-2" />
                    Sauvegarder
                  </>
                )}
              </button>
            </div>

            <div className="modal-book-details-section">
              <h2 id="modal-title">{selectedBook.title}</h2>
              <p><strong>Auteur(s):</strong> {selectedBook.author_name?.join(', ') || 'Auteur inconnu'}</p>
              <p><strong>Première publication:</strong> {selectedBook.first_publish_year || 'Année inconnue'}</p>
              {selectedBook.ratings_average && (
                <p className="modal-rating">
                  <strong>Note moyenne:</strong> {selectedBook.ratings_average.toFixed(1)}/5{' '}
                  <span className="rating-stars-modal">{getRatingStars(selectedBook.ratings_average)}</span>
                </p>
              )}
              {selectedBook.subject && selectedBook.subject.length > 0 && (
                <p><strong>Sujets:</strong> {selectedBook.subject.slice(0, 5).join(', ')}</p>
              )}
              {selectedBook.isbn && (
                <p><strong>ISBN:</strong> {selectedBook.isbn.find(isbn => isbn.startsWith('978')) || selectedBook.isbn[0]}</p>
              )}
              {selectedBook.number_of_pages_median && (
                <p><strong>Nombre de pages:</strong> {selectedBook.number_of_pages_median}</p>
              )}
              {selectedBook.language && selectedBook.language.length > 0 && (
                <p><strong>Langue(s):</strong> {Array.isArray(selectedBook.language) ? selectedBook.language.map(lang => lang.toUpperCase()).join(', ') : selectedBook.language.toUpperCase()}</p>
              )}
              {selectedBook.want_to_read_count && (
                <p><strong>Popularité:</strong> {selectedBook.want_to_read_count.toLocaleString()} personnes intéressées</p>
              )}

              <div className="modal-external-links">
                {selectedBook.oclc && selectedBook.oclc[0] && (
                  <a
                    href={`https://www.worldcat.org/oclc/${selectedBook.oclc[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link-button"
                  >
                    <ExternalLink className="w-4 h-4 inline-block mr-1" />
                    WorldCat
                  </a>
                )}
                {selectedBook.key && (
                  <a
                    href={`https://openlibrary.org${selectedBook.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link-button"
                  >
                    <ExternalLink className="w-4 h-4 inline-block mr-1" />
                    Open Library
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
