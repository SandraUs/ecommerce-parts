import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import Ecommerce from './Ecommerce.jsx'
import './index.css';
import { StoreProvider } from "./store";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <Ecommerce />
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
