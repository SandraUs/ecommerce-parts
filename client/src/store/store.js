import { createStore } from "redux";

const SESSION_KEY = "userData";

const getInitialUser = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
};

const reducer = (state = initialState, action) => {
  switch (action?.type) {
    case "SET_USER":
      return { ...state, user: action.payload ?? null };
    default:
      return state;
  }
};

export const store = createStore(reducer);

