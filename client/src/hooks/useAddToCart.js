import { useCallback, useState } from "react";

import { withAuth, API_BASE } from "../bff/api";
import { addToGuestCart } from "../cart/guestCart";
import { useSelector } from "../store";
import { selectUser } from "../selectors";

export const useAddToCart = ({ source } = {}) => {
  const [addingId, setAddingId] = useState(null);
  const user = useSelector(selectUser);

  const addToCart = useCallback(
    async (product) => {
      if (!product?.id || addingId) return;
      if (!user?.token) {
        addToGuestCart(product);
        window.dispatchEvent(new Event("cart-updated"));
        return;
      }

      setAddingId(product.id);
      try {
        await fetch(
          `${API_BASE}/cart`,
          withAuth(user.token, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: product.id, quantity: 1 }),
          })
        );
        window.dispatchEvent(new Event("cart-updated"));
      } catch (e) {
        console.error(`Ошибка добавления в корзину${source ? ` (${source})` : ""}`, e);
      } finally {
        setAddingId(null);
      }
    },
    [addingId, source, user?.token]
  );

  return { addingId, addToCart };
};

