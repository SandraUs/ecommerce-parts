import { useEffect, useState } from 'react';
import { NewsItem } from './NewsItem';
import './news.css';
import { API_BASE } from '../../bff/api';

export const News = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/news`)
      .then(res => res.json())
      .then(data => setNews(data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="news">Загрузка новостей...</div>;
  }

  if (news.length === 0) {
    return <div className="news empty">Новостей пока нет</div>;
  }

  return (
    <div className="news">
      {news.map(item => (
        <NewsItem
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          date={item.date}
        />
      ))}
    </div>
  );
};
