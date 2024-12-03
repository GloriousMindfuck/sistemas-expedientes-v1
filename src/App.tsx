import React, { Suspense, lazy, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useNavigate,
  Outlet 
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Layout Components
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';
import PrivateRoute from './components/PrivateRoute';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ExpedientesPage = lazy(() => import('./pages/ExpedientesPage'));
const ExpedienteFormPage = lazy(() => import('./pages/ExpedienteFormPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

// Importaciones de servicios
import { ExpedienteService } from './services/expedienteService';

const AppLayout: React.FC = () => {
  // Inicializar datos de ejemplo al cargar el layout
  useEffect(() => {
    ExpedienteService.inicializar();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <Toaster 
        position="top-right" 
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 }
        }} 
      />
    </div>
  );
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    console.log('Estado de autenticación:', auth);
    if (!auth?.user) {
      navigate('/login');
    }
  }, [auth, navigate]);

  useEffect(() => {
    const handleLogout = () => {
      navigate('/login');
    };

    window.addEventListener('auth-logout', handleLogout);

    return () => {
      window.removeEventListener('auth-logout', handleLogout);
    };
  }, [navigate]);

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        <Route element={<PrivateRoute allowedRoles={['ADMIN', 'USER', 'VIEWER']} />}>
          <Route element={<AppLayout />}>
            <Route 
              path="/dashboard" 
              element={<DashboardPage />} 
            />
            <Route 
              path="/expedientes" 
              element={<ExpedientesPage />} 
            />
            <Route 
              path="/expedientes/nuevo" 
              element={<ExpedienteFormPage />} 
            />
            <Route 
              path="/expedientes/editar/:id" 
              element={<ExpedienteFormPage />} 
            />
            <Route 
              path="/configuracion" 
              element={<SettingsPage />} 
            />
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            {/* Ruta comodín para manejar rutas no encontradas */}
            <Route 
              path="*" 
              element={<Navigate to="/dashboard" replace />} 
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
