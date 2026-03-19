import { Link } from 'react-router-dom';


export const NewsItem = ({ id, title, description, date }) => {
  return (
    <div className="news-item">
      <span className="news-date">
        {new Date(date).toLocaleDateString('ru-RU')}
      </span>

      <h3 className="news-title">
        <Link to={`/news/${id}`}>{title}</Link>
      </h3>

      <p className="news-description">{description}</p>
    </div>
  );
};
