import { API_BASE, withAuth } from "../bff/api";
import { clearGuestCart, getGuestCart } from "./guestCart";

let lastSyncedToken = null;

export const syncGuestCartToServer = async (token) => {
  if (!token) return;
  if (lastSyncedToken === token) return;

  const items = getGuestCart();
  if (!items.length) {
    lastSyncedToken = token;
    return;
  }

  try {
    for (const item of items) {
      const quantity = Number(item.quantity ?? 1);
      if (!item?.id || !Number.isFinite(quantity) || quantity <= 0) continue;

      await fetch(
        `${API_BASE}/cart`,
        withAuth(token, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id, quantity }),
        })
      );
    }

    clearGuestCart();
    window.dispatchEvent(new Event("cart-updated"));
    lastSyncedToken = token;
  } catch (e) {
    console.error("Ошибка синхронизации гостевой корзины", e);
  }
};

