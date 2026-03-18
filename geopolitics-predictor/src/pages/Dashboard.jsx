import { useMemo } from 'react';
import PredictionCard from '../components/PredictionCard.jsx';
import { formatCategoryLabel } from '../utils/questionFormat.js';

export default function Dashboard({ questions, loading, error, activeCategory, searchQuery }) {
  const filtered = useMemo(() => {
    let result = questions;

    if (activeCategory !== 'all') {
      result = result.filter((q) => q.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((q) => q.title.toLowerCase().includes(query));
    }

    return result;
  }, [questions, activeCategory, searchQuery]);

  const title =
    activeCategory === 'all'
      ? 'All Markets'
      : `${filtered.length} ${formatCategoryLabel(activeCategory)} Markets`;

  return (
    <main className="main-content" id="dashboard">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">
          AI-powered probability estimates • Updated every 3-4 hours
        </p>
      </div>

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-secondary)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⏳</div>
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>Loading markets...</p>
        </div>
      ) : error ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--red)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>Failed to load predictions</p>
          <p style={{ fontSize: '0.875rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
            {error}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-secondary)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>No predictions found</p>
          <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>
            Try a different category or search term
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((q, i) => (
            <PredictionCard key={q.id} question={q} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
