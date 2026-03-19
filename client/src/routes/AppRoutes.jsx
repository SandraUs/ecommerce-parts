import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '../components/routing/PrivateRoute';
import { AdminRoute } from '../components/routing/AdminRoute';
import { HomeRoute } from './HomeRoute';

import { Stores } from '../pages/Stores/Stores';
import { Delivery } from '../pages/Delivery/Delivery';
import { Pay } from '../pages/Pay/Pay';
import { NewsListPage } from '../pages/NewsList/NewsListPage';
import { NewsPage } from '../pages/News/NewsPage';
import { Vacancies } from '../pages/Vacancies/Vacancies';
import { Contacts } from '../pages/Contacts/Contacts';
import { Login } from '../pages/Auth/Login';
import { Registration } from '../pages/Auth/Registration';
import { Profile } from '../pages/Profile/Profile';
import { Cart } from '../pages/Cart/Cart';
import { Orders } from '../pages/Orders/Orders';
import { ProductsPage } from '../pages/Catalog/ProductsPage';
import { ProductPage } from '../pages/Product/ProductPage';
import { SearchPage } from '../pages/Search/SearchPage';
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';
import { ProductsAdminPage } from '../pages/Admin/ProductsAdminPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/stores" element={<Stores />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/pay" element={<Pay />} />
      <Route path="/news" element={<NewsListPage />} />
      <Route path="/news/:id" element={<NewsPage />} />
      <Route path="/vacancies" element={<Vacancies />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/catalog/:categoryId" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/search" element={<SearchPage />} />

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <ProductsAdminPage />
          </AdminRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

