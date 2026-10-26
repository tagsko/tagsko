import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LogTimeForm from './pages/LogTimeForm';
import Reflections from './pages/Reflections';
import OwnerTools from './pages/OwnerTools';
import AdminPanel from './pages/AdminPanel';
import DocumentsPage from './pages/Documents';
import LoginPage from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function Protected({ roles }: { roles?: Array<'employee' | 'owner' | 'admin'> }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="pb-10">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}> 
              <Route element={<Protected roles={['employee','owner','admin']} />}> 
                <Route path="/" element={<Dashboard />} />
                <Route path="/log" element={<LogTimeForm />} />
                <Route path="/reflections" element={<Reflections />} />
                <Route path="/documents" element={<DocumentsPage />} />
              </Route>
              <Route element={<Protected roles={['owner','admin']} />}> 
                <Route path="/owner" element={<OwnerTools />} />
              </Route>
              <Route element={<Protected roles={['admin']} />}> 
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
