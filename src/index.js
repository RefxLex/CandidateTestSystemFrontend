import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './hooks/ErrorBoundary';
import Error from './components/Pages/Error';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<Error/>}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App/>}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);