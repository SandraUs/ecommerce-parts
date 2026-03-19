import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './catalogCategories.css';
import { API_BASE } from '../../bff/api';

export const CatalogCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="categories">
      <div className="categories-row">
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/catalog/${category.id}`}
            className="category-card"
          >
              {category.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
