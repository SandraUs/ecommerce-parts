import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_BASE } from '../../bff/api';
import '../Catalog/styles.css';
import { useAddToCart } from '../../hooks';
import { ProductCard } from '../../components/productCard/ProductCard';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim();

  const [products, setProducts] = useState([]);
  const [lastCompletedQuery, setLastCompletedQuery] = useState('');
  const { addingId, addToCart } = useAddToCart({ source: 'search' });

  const queryString = useMemo(() => new URLSearchParams({ q }).toString(), [q]);

  const latestQueryRef = useRef(q);
  useEffect(() => {
    latestQueryRef.current = q;
  }, [q]);

  useEffect(() => {
    if (!q) {
      return;
    }

    fetch(`${API_BASE}/products?${queryString}`)
      .then((res) => res.json())
      .then((data) => {
        if (latestQueryRef.current !== q) return;
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Ошибка поиска товаров', err);
        if (latestQueryRef.current !== q) return;
        setProducts([]);
      })
      .finally(() => {
        if (latestQueryRef.current !== q) return;
        setLastCompletedQuery(q);
      });
  }, [q, queryString]);

  return (
    <div className="products-page">
      <h1 className="page-title">Поиск</h1>

      {q ? (
        <div style={{ marginBottom: 12, opacity: 0.8 }}>
          Запрос: <b>{q}</b>
        </div>
      ) : (
        <div style={{ marginBottom: 12, opacity: 0.8 }}>
          Введите запрос в поиске сверху.
        </div>
      )}

      {q && lastCompletedQuery === q && products.length === 0 && (
        <div style={{ marginBottom: 12 }}>Ничего не найдено.</div>
      )}

      <div className="products-grid">
        {(q ? products : []).map((product) => (
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

