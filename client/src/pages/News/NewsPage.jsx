import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './styles.css';
import { API_BASE } from '../../bff/api';

export const NewsPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/news`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(list =>
        setNews(
          (list || []).find(n => String(n.id) === String(id)) ?? null
        )
      )
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div>Загрузка...</div>;
  if (!news) return <div>Новость не найдена</div>;

  return (
    <div className="news-page">
      <Link to="/news" className="news-back">
        ← Назад к новостям
      </Link>

      <span className="news-date">
        {new Date(news.date).toLocaleDateString('ru-RU')}
      </span>

      <h1>{news.title}</h1>
      <p>{news.description}</p>
    </div>
  );
};

