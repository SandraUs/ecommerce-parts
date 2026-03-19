import { useEffect, useMemo, useState } from "react";
import "./products-admin.css";
import { API_BASE, withAuth } from "../../bff/api";
import { useSelector } from "../../store";
import { selectUser } from "../../selectors";
import { ConfirmDialog } from "../../components/ConfirmDialog/ConfirmDialog";
import "../../components/ConfirmDialog/confirm-dialog.css";

const emptyForm = {
  id: null,
  name: "",
  price: "",
  brandId: "",
  typeId: "",
  img: null,
};

export const ProductsAdminPage = () => {
  const user = useSelector(selectUser);
  const token = user?.token ?? null;

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const isEdit = useMemo(() => !!form.id, [form.id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, brandsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE}/device`),
        fetch(`${API_BASE}/brand`),
        fetch(`${API_BASE}/categories`),
      ]);

      const productsData = await productsRes.json();
      const brandsData = await brandsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(productsData?.rows ?? productsData ?? []);
      setBrands(brandsData ?? []);
      setCategories(categoriesData ?? []);
    } catch (e) {
      setError(e?.message || "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "img") {
      setForm((prev) => ({ ...prev, img: files?.[0] ?? null }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (product) => {
    setForm({
      id: product.id,
      name: product.name ?? "",
      price: String(product.price ?? ""),
      brandId: product.brandId ? String(product.brandId) : "",
      typeId: product.typeId ? String(product.typeId) : "",
      img: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetForm = () => {
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Нет токена авторизации");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (!form.name || !form.price) {
        setError("Заполните название и цену");
        return;
      }

      if (isEdit) {
        const res = await fetch(
          `${API_BASE}/device/${form.id}`,
          withAuth(token, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: form.name,
              price: Number(form.price),
              brandId: form.brandId || null,
              typeId: form.typeId || null,
            }),
          })
        );

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Ошибка обновления товара");
        }
      } else {
        const data = new FormData();
        data.append("name", form.name);
        data.append("price", String(form.price));
        if (form.brandId) data.append("brandId", String(form.brandId));
        if (form.typeId) data.append("typeId", String(form.typeId));
        if (form.img) data.append("img", form.img);

        const res = await fetch(
          `${API_BASE}/device`,
          withAuth(token, {
            method: "POST",
            body: data,
          })
        );

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Ошибка создания товара");
        }
      }

      await loadInitialData();
      setForm(emptyForm);
    } catch (e) {
      setError(e?.message || "Ошибка сохранения товара");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token || !id) return;
    try {
      setSaving(true);
      setError(null);

      const res = await fetch(
        `${API_BASE}/device/${id}`,
        withAuth(token, {
          method: "DELETE",
        })
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Ошибка удаления товара");
      }

      await loadInitialData();
      if (form.id === id) {
        setForm(emptyForm);
      }
    } catch (e) {
      setError(e?.message || "Ошибка удаления товара");
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (product) => {
    if (!product?.id) return;
    setDeleteCandidate({ id: product.id, name: product.name ?? "" });
  };

  const cancelDelete = () => setDeleteCandidate(null);

  const confirmDelete = async () => {
    if (!deleteCandidate?.id) return;
    const id = deleteCandidate.id;
    setDeleteCandidate(null);
    await handleDelete(id);
  };

  return (
    <div className="admin-products-page">
      <h1 className="admin-title">Админ‑панель: товары</h1>

      <section className="admin-section">
        <h2 className="admin-section-title">
          {isEdit ? "Редактирование товара" : "Создание товара"}
        </h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <label>
              Название
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Введите название товара"
              />
            </label>

            <label>
              Цена (₽)
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
              />
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              Категория
              <select
                name="typeId"
                value={form.typeId}
                onChange={handleChange}
              >
                <option value="">Не выбрано</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Бренд
              <select
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
              >
                <option value="">Не выбрано</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {!isEdit && (
            <div className="admin-form-row">
              <label>
                Изображение
                <input
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={handleChange}
                />
              </label>
            </div>
          )}

          {error && <div className="admin-error">{error}</div>}

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-btn primary"
              disabled={saving}
            >
              {saving
                ? "Сохраняем..."
                : isEdit
                ? "Сохранить изменения"
                : "Создать товар"}
            </button>
            {isEdit && (
              <button
                type="button"
                className="admin-btn secondary"
                onClick={handleResetForm}
                disabled={saving}
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Список товаров</h2>

        {loading ? (
          <div className="admin-info">Загружаем товары...</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Категория</th>
                  <th>Бренд</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                    <td>{p.typeId}</td>
                    <td>{p.brandId}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-link"
                        onClick={() => handleEditClick(p)}
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        className="admin-link danger"
                        onClick={() => requestDelete(p)}
                        disabled={saving}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="admin-empty">
                      Товары не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={!!deleteCandidate}
        title="Удалить товар?"
        description={
          deleteCandidate?.name
            ? `Товар: ${deleteCandidate.name}\nЭто действие нельзя отменить.`
            : "Это действие нельзя отменить."
        }
        confirmText={saving ? "Удаляем..." : "Удалить"}
        cancelText="Отмена"
        danger
        disabled={saving}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

