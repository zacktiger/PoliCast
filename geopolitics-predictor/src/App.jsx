import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CategoryBar from './components/CategoryBar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import QuestionDetail from './pages/QuestionDetail.jsx';
import { useState } from 'react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-container">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CategoryBar
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
              <Dashboard
                activeCategory={activeCategory}
                searchQuery={searchQuery}
              />
            </>
          }
        />
        <Route path="/question/:id" element={<QuestionDetail />} />
      </Routes>
      <footer className="app-footer">
        <p>GeoPulse © 2026 — AI-Powered Geopolitical Predictions • Data is simulated for demonstration</p>
      </footer>
    </div>
  );
}
