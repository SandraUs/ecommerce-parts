const STORAGE_KEY = "guest-cart-v1";

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const getGuestCart = () => read();

export const getGuestCartCount = () =>
  read().reduce((sum, item) => sum + (item.quantity ?? 1), 0);

export const addToGuestCart = (product) => {
  if (!product?.id) return;

  const items = read();
  const idx = items.findIndex((i) => String(i.id) === String(product.id));

  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: (items[idx].quantity ?? 1) + 1 };
  } else {
    items.push({
      id: product.id,
      title: product.title,
      price: product.price,
      article: product.article,
      image: product.image,
      quantity: 1,
    });
  }

  write(items);
};

export const setGuestCartQuantity = (id, quantity) => {
  const q = Number(quantity);
  if (!Number.isFinite(q)) return;

  const items = read()
    .map((i) => (String(i.id) === String(id) ? { ...i, quantity: q } : i))
    .filter((i) => (i.quantity ?? 1) > 0);

  write(items);
};

export const removeFromGuestCart = (id) => {
  const items = read().filter((i) => String(i.id) !== String(id));
  write(items);
};

export const clearGuestCart = () => write([]);

