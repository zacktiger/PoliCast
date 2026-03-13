import { Link } from 'react-router-dom';

export default function Navbar({ searchQuery, setSearchQuery }) {
  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <div className="logo-icon">📊</div>
          <span className="logo-text">GeoPulse</span>
        </Link>

        <div className="navbar-search">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            placeholder="Search predictions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="navbar-right">
          <div className="navbar-badge" id="ai-status-badge">
            <span className="pulse-dot" />
            AI Model Active
          </div>
        </div>
      </div>
    </nav>
  );
}
