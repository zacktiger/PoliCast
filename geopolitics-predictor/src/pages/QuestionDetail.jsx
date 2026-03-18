import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchQuestionDetail } from '../api/questions.js';
import {
  getCurrentProb,
  get24hChange,
  getLastUpdated,
  getCategoryIcon,
  formatCategoryLabel,
} from '../utils/questionFormat.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const TIMEFRAMES = [
  { label: '24H', points: 7 },
  { label: '7D', points: 48 },
  { label: '30D', points: 206 },
  { label: 'All', points: Infinity },
];

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('30D');
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadQuestion = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchQuestionDetail(id);
        if (isMounted) {
          setQuestion(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load question details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadQuestion();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const prob = getCurrentProb(question);
  const change = get24hChange(question);
  const lastUpdated = getLastUpdated(question);
  const categoryIcon = getCategoryIcon(question?.category);
  const categoryLabel = formatCategoryLabel(question?.category);

  const tf = TIMEFRAMES.find((t) => t.label === timeframe);
  const historySlice = useMemo(() => {
    if (!question?.history?.length) return [];
    if (tf.points === Infinity) return question.history;
    return question.history.slice(-tf.points);
  }, [question, tf]);

  const chartPoints = historySlice.length > 0 ? historySlice : [{ timestamp: Date.now(), probability: prob }];

  // Calculate probability range info
  const allProbs = (question?.history || []).map((p) => p.probability);
  const minSource = allProbs.length > 0 ? allProbs : [prob];
  const minProb = Math.round(Math.min(...minSource));
  const maxProb = Math.round(Math.max(...minSource));
  const resolution = question?.resolution || 'N/A';
  const drivers = question?.drivers || [];
  const hasConfidence = typeof question?.aiConfidence === 'number';

  if (loading) {
    return (
      <main className="main-content">
        <button className="detail-back-btn" onClick={() => navigate('/')}>
          ← Back to Markets
        </button>
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⏳</div>
          <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Loading question...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content">
        <button className="detail-back-btn" onClick={() => navigate('/')}>
          ← Back to Markets
        </button>
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--red)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚠️</div>
          <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Failed to load question</p>
          <p style={{ fontSize: '0.95rem', marginTop: '8px', color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </main>
    );
  }

  if (!question) {
    return (
      <main className="main-content">
        <button className="detail-back-btn" onClick={() => navigate('/')}>
          ← Back to Markets
        </button>
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>❓</div>
          <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Question not found</p>
        </div>
      </main>
    );
  }

  // Chart data
  const chartData = {
    labels: chartPoints.map((p) => {
      const d = new Date(p.timestamp);
      if (timeframe === '24H') {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'YES Probability',
        data: chartPoints.map((p) => p.probability),
        borderColor: '#06b6d4',
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: context, chartArea } = chart;
          if (!chartArea) return 'transparent';
          const gradient = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0.02)');
          return gradient;
        },
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#06b6d4',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.35,
      },
      {
        label: 'NO Probability',
        data: chartPoints.map((p) => 100 - p.probability),
        borderColor: '#f85149',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#f85149',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        fill: false,
        tension: 0.35,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#8b949e',
          font: { size: 11, family: 'Inter' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#1c2128',
        titleColor: '#e6edf3',
        bodyColor: '#8b949e',
        borderColor: '#30363d',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 12, weight: 600, family: 'Inter' },
        bodyFont: { size: 12, family: 'Inter' },
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#6e7681',
          font: { size: 10, family: 'Inter' },
          maxTicksLimit: 10,
          maxRotation: 0,
        },
        grid: {
          color: 'rgba(48, 54, 61, 0.4)',
          drawBorder: false,
        },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: '#6e7681',
          font: { size: 10, family: 'Inter' },
          callback: (val) => `${val}%`,
          stepSize: 25,
        },
        grid: {
          color: 'rgba(48, 54, 61, 0.4)',
          drawBorder: false,
        },
        border: { display: false },
      },
    },
  };


  return (
    <main className="main-content detail-page" id={`detail-${question.id}`}>
      {/* Back button */}
      <button
        className="detail-back-btn"
        id="detail-back"
        onClick={() => navigate('/')}
      >
        ← Back to Markets
      </button>

      {/* Header */}
      <div className="detail-header">
        <div className="detail-title-section">
          <div className="detail-category">
            <span>{categoryIcon}</span>
            {categoryLabel}
          </div>
          <h1 className="detail-title">{question.title}</h1>
          <div className="detail-meta-row">
            <div className="detail-meta-item">
              🕐 Updated {lastUpdated}
            </div>
            <div className="detail-meta-item">
              📅 Resolves {resolution}
            </div>
          </div>
        </div>

        <div className="detail-prob-card">
          <div className="detail-prob-yes">{prob}%</div>
          <div className="detail-prob-label">YES probability</div>
          <div className="detail-prob-no">{100 - prob}% NO</div>
          <div className={`detail-prob-change ${change >= 0 ? 'up' : 'down'}`}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% (24h)
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="detail-chart-container" id="detail-chart">
        <div className="chart-header">
          <h2 className="chart-title">📈 Probability Over Time</h2>
          <div className="chart-timeframes">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.label}
                className={`timeframe-btn${timeframe === tf.label ? ' active' : ''}`}
                id={`tf-${tf.label}`}
                onClick={() => setTimeframe(tf.label)}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Drivers + Info */}
      <div className="detail-grid">
        {/* Drivers panel */}
        <div className="drivers-section" id="drivers-panel">
          <h3 className="drivers-title">
            ⚡ Key Drivers
          </h3>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginBottom: '14px',
            lineHeight: 1.5,
          }}>
            Probability moved from{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {Math.round(question.history[Math.max(0, question.history.length - 8)]?.probability || 0)}%
            </strong>
            {' → '}
            <strong style={{ color: change >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {prob}%
            </strong>
            {' in the last 24 hours'}
          </p>
          {drivers.length === 0 ? (
            <div className="driver-item">
              <span className="driver-text">No signal drivers available yet.</span>
            </div>
          ) : (
            drivers.map((driver, i) => (
              <div className="driver-item" key={i}>
                <div className={`driver-icon ${driver.impact}`}>
                  {driver.impact === 'up' ? '↑' : '↓'}
                </div>
                <span className="driver-text">{driver.text}</span>
              </div>
            ))
          )}
        </div>

        {/* Market Info panel */}
        <div className="info-section" id="info-panel">
          <h3 className="info-title">📊 Market Info</h3>
          <div className="info-row">
            <span className="info-label">Category</span>
            <span className="info-value cyan">{categoryIcon} {categoryLabel}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Current YES</span>
            <span className="info-value" style={{ color: 'var(--green)' }}>{prob}%</span>
          </div>
          <div className="info-row">
            <span className="info-label">Current NO</span>
            <span className="info-value" style={{ color: 'var(--red)' }}>{100 - prob}%</span>
          </div>
          <div className="info-row">
            <span className="info-label">24h Change</span>
            <span className="info-value" style={{ color: change >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">All-Time Range</span>
            <span className="info-value">{minProb}% — {maxProb}%</span>
          </div>
          <div className="info-row">
            <span className="info-label">Resolution Date</span>
            <span className="info-value amber">{resolution}</span>
          </div>
          {hasConfidence ? (
            <>
              <div className="info-row">
                <span className="info-label">AI Confidence</span>
                <span className="info-value purple">🤖 {question.aiConfidence}%</span>
              </div>
              <div className="confidence-bar-bg">
                <div
                  className="confidence-bar-fill"
                  style={{ width: `${question.aiConfidence}%` }}
                />
              </div>
            </>
          ) : null}
          <div className="info-row">
            <span className="info-label">Data Points</span>
            <span className="info-value">{question.history.length}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Update Frequency</span>
            <span className="info-value">~3-4 hours</span>
          </div>
        </div>
      </div>
    </main>
  );
}
