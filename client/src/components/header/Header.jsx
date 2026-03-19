import { useEffect, useMemo, useState } from "react";
import {
  UserIcon,
  HeartIcon,
  CompareIcon,
  CartIcon,
  SearchIcon,
  StoreIcon,
  LogoutIcon
} from "../icons";
import logo from "../../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header.css";
import { useDispatch, useSelector } from "../../store";
import { setUser } from "../../actions";
import { selectUser, selectUserRole } from "../../selectors";
import { ROLE } from "../../constants";
import { API_BASE, withAuth } from "../../bff/api";
import { getGuestCartCount } from "../../cart/guestCart";
import { syncGuestCartToServer } from "../../cart/syncGuestCartToServer";

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Ошибка загрузки категорий", err));
  }, []);

  return categories;
};

export const Header = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const roleId = useSelector(selectUserRole);
  const categories = useCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const trimmedSearch = useMemo(() => searchValue.trim(), [searchValue]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("userData");
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch(setUser(parsed));
      }
    } catch {
      //
    }
  }, [dispatch]);

  useEffect(() => {
    const loadCartCount = () => {
      if (!user?.token) {
        setCartCount(getGuestCartCount());
        return;
      }

      fetch(`${API_BASE}/cart`, withAuth(user.token))
        .then((res) => res.json())
        .then((data) => {
          const count = data.reduce(
            (sum, item) => sum + (item.quantity ?? 1),
            0
          );
          setCartCount(count);
        })
        .catch((err) =>
          console.error("Ошибка загрузки количества товаров в корзине", err)
        );
    };

    loadCartCount();

    const handleCartUpdated = () => {
      loadCartCount();
    };

    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, [user?.token]);

  useEffect(() => {
    syncGuestCartToServer(user?.token);
  }, [user?.token]);

  const handleLogout = () => {
    sessionStorage.removeItem("userData");
    dispatch(setUser(null));
  };

  const toggleCatalog = () => {
    setIsCatalogOpen((prev) => !prev);
  };

  const handleCategoryClick = (categoryId) => {
    setIsCatalogOpen(false);
    navigate(`/catalog/${categoryId}`);
  };

  useEffect(() => {
    const q = trimmedSearch;
    if (!q) return;
    if (location.pathname !== "/search") return;

    const t = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }, 400);

    return () => clearTimeout(t);
  }, [trimmedSearch, navigate, location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = trimmedSearch;
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-top-left">
          <div className="stores-link">
            <StoreIcon className="store-icon" />
            <Link to="/stores" className="nav-link">
              Магазины
            </Link>
          </div>

          <nav className="header-top-nav">
            <Link to="/delivery" className="nav-link">
              Доставка
            </Link>
            <Link to="/pay" className="nav-link">
              Оплата
            </Link>
            <Link to="/news" className="nav-link">
              Новости
            </Link>
            <Link to="/vacancies" className="nav-link">
              Вакансии
            </Link>
            <Link to="/contacts" className="nav-link">
              Контакты
            </Link>
            {user && roleId === ROLE.ADMIN && (
              <Link to="/admin/products" className="nav-link">
                Админка
              </Link>
            )}
          </nav>
        </div>

        <div className="header-top-right">
          <div className="phone-dropdown">
            <span className="phone">8-800-755-44-50</span>
            <span className="phone-arrow">▼</span>

            <div className="phone-dropdown-menu">
              <a href="mailto:akgs@akgs.market" className="phone-dropdown-item">
                <span className="phone-dropdown-label">E-Mail:</span>
                <span className="phone-dropdown-value">akgs@akgs.market</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="header-left">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="АКГС автоцентр" className="logo-image" />
            </Link>
          </div>

          <div className="catalog-wrapper">
            <button className="catalog-btn" onClick={toggleCatalog}>
              <span className="hamburger">☰</span>
              <span>Каталог</span>
            </button>

            {isCatalogOpen && (
              <div className="catalog-dropdown">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className="catalog-dropdown-item"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="header-center">
          <form className="search-wrapper" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Найти"
              className="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button type="submit" className="search-btn" aria-label="Поиск">
              <SearchIcon className="search-icon" />
            </button>
          </form>
        </div>

        <div className="header-right">
          {user ? (
            <>
              <Link to="/profile" className="icon-btn login-btn" title="Профиль">
                <UserIcon className="icon" />
              </Link>
              <button
                className="icon-btn logout-btn"
                onClick={handleLogout}
                title="Выйти"
              >
                <LogoutIcon className="icon" />
              </button>
            </>
          ) : (
            <Link to="/login" className="icon-btn login-btn">
              <UserIcon className="icon" />
            </Link>
          )}

          <button className="icon-btn with-badge">
            <HeartIcon className="icon" />
          </button>

          <Link to="/orders" className="icon-link">
            <CompareIcon className="icon" />
          </Link>

          <Link to="/cart" className="icon-link with-badge">
            <CartIcon className="icon" />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};
