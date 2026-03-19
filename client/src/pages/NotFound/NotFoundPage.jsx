import { Link } from 'react-router-dom';
import './styles.css';

export const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Страница не найдена</p>

      <Link to="/">Вернуться на главную</Link>
    </div>
  );
};

