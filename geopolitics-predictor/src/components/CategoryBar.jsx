import { categories } from '../data/questions.js';

export default function CategoryBar({ activeCategory, setActiveCategory }) {
  return (
    <div className="category-bar" id="category-bar">
      <div className="category-bar-inner">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`cat-btn-${cat.id}`}
            className={`category-btn${activeCategory === cat.id ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
