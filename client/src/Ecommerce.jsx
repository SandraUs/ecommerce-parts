import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import './Ecommerce.css';
import { AppRoutes } from './routes/AppRoutes';

const Ecommerce = () => {
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
};

export default Ecommerce;
