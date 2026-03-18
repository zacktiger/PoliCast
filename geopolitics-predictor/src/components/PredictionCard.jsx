import { useNavigate } from 'react-router-dom';
import {
  getCurrentProb,
  get24hChange,
  getLastUpdated,
  getCategoryIcon,
  formatCategoryLabel,
} from '../utils/questionFormat.js';
import Sparkline from './Sparkline.jsx';

export default function PredictionCard({ question, index }) {
  const navigate = useNavigate();
  const prob = getCurrentProb(question);
  const change = get24hChange(question);
  const lastUpdated = getLastUpdated(question);
  const categoryLabel = formatCategoryLabel(question.category);
  const categoryIcon = getCategoryIcon(question.category);

  // Get last 48 data points for sparkline (~7 days)
  const sparkData = question.history.slice(-48).map((p) => p.probability);
  const resolution = question.resolution || 'N/A';

  return (
    <div
      className="prediction-card card-appear"
      id={`card-${question.id}`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => navigate(`/question/${question.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/question/${question.id}`)}
    >
      {/* Category tag */}
      <div className="card-category-tag">
        <span>{categoryIcon}</span>
        {categoryLabel}
      </div>

      {/* Title */}
      <h3 className="card-title">{question.title}</h3>

      {/* Probability + Change */}
      <div className="card-prob-row">
        <div className="card-prob-value">
          <span className={`prob-number ${prob >= 50 ? 'green' : 'red'}`}>
            {prob}%
          </span>
          <span className="prob-label">YES</span>
        </div>
        <div className={`card-change ${change >= 0 ? 'up' : 'down'}`}>
          <span className="arrow">{change >= 0 ? '▲' : '▼'}</span>
          {Math.abs(change)}%
        </div>
      </div>

      {/* Sparkline */}
      <div className="card-sparkline">
        <Sparkline data={sparkData} color={prob >= 50 ? '#3fb950' : '#f85149'} />
      </div>

      {/* Yes/No buttons */}
      <div className="card-buttons">
        <button
          className="card-btn yes"
          id={`card-${question.id}-yes`}
          onClick={(e) => e.stopPropagation()}
        >
          Yes {prob}%
        </button>
        <button
          className="card-btn no"
          id={`card-${question.id}-no`}
          onClick={(e) => e.stopPropagation()}
        >
          No {100 - prob}%
        </button>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="card-meta">
          <span>Updated {lastUpdated}</span>
          <span className="meta-dot" />
          <span>Resolves {resolution}</span>
        </div>
        {typeof question.aiConfidence === 'number' ? (
          <div className="card-ai-score">
            🤖 {question.aiConfidence}%
          </div>
        ) : null}
      </div>
    </div>
  );
}
