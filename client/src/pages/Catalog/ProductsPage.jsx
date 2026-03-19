import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles.css';
import { API_BASE } from '../../bff/api';
import { useAddToCart } from '../../hooks';
import { ProductCard } from '../../components/productCard/ProductCard';

export const ProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const { addingId, addToCart } = useAddToCart({ source: 'catalog' });

  useEffect(() => {
    fetch(`${API_BASE}/products?categoryId=${categoryId}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [categoryId]);

  return (
    <div className="products-page">
      <h1 className="page-title">Товары</h1>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            isAdding={addingId === product.id}
          />
        ))}
      </div>
    </div>
  );
};

