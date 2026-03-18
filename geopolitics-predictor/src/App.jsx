import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CategoryBar from './components/CategoryBar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import QuestionDetail from './pages/QuestionDetail.jsx';
import { useEffect, useMemo, useState } from 'react';
import { fetchQuestions } from './api/questions.js';
import { formatCategoryLabel, getCategoryIcon } from './utils/questionFormat.js';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      try {
        setLoadingQuestions(true);
        setQuestionsError('');
        const data = await fetchQuestions();
        if (isMounted) {
          setQuestions(data);
        }
      } catch (error) {
        if (isMounted) {
          setQuestionsError(error.message || 'Failed to load questions');
        }
      } finally {
        if (isMounted) {
          setLoadingQuestions(false);
        }
      }
    };

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(questions.map((q) => q.category))).filter(Boolean);

    return [
      { id: 'all', label: 'All Markets', icon: '🌐' },
      ...unique.map((category) => ({
        id: category,
        label: formatCategoryLabel(category),
        icon: getCategoryIcon(category),
      })),
    ];
  }, [questions]);

  useEffect(() => {
    const exists = categories.some((cat) => cat.id === activeCategory);
    if (!exists) {
      setActiveCategory('all');
    }
  }, [categories, activeCategory]);

  return (
    <div className="app-container">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CategoryBar
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
              <Dashboard
                questions={questions}
                loading={loadingQuestions}
                error={questionsError}
                activeCategory={activeCategory}
                searchQuery={searchQuery}
              />
            </>
          }
        />
        <Route path="/question/:id" element={<QuestionDetail />} />
      </Routes>
      <footer className="app-footer">
        <p>GeoPulse © 2026 — AI-Powered Geopolitical Predictions</p>
      </footer>
    </div>
  );
}
