import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { roleLabel } from '../mock/data';
import { LogOut, FileText, LayoutDashboard, ClipboardList, PenLine, Shield } from 'lucide-react';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur dark:bg-gray-900/80 sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-7 rounded bg-indigo-600" />
          <span className="font-semibold">Prosper SkatteFUNN Companion</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-4 text-sm">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300'}>
            <div className="flex items-center gap-1"><LayoutDashboard className="size-4"/> Dashboard</div>
          </NavLink>
          <NavLink to="/log" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300'}>
            <div className="flex items-center gap-1"><ClipboardList className="size-4"/> Log Time</div>
          </NavLink>
          <NavLink to="/reflections" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300'}>
            <div className="flex items-center gap-1"><PenLine className="size-4"/> Reflections</div>
          </NavLink>
          <NavLink to="/documents" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300'}>
            <div className="flex items-center gap-1"><FileText className="size-4"/> Documents</div>
          </NavLink>
          {user?.role !== 'employee' && (
            <NavLink to="/owner" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300'}>
              Owner Tools
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300'}>
              <div className="flex items-center gap-1"><Shield className="size-4"/> Admin</div>
            </NavLink>
          )}
        </nav>
        {user ? (
          <button
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
            onClick={async () => { await signOut(); navigate('/login'); }}
          >
            <span className="hidden sm:block">{user.name} • {roleLabel(user.role)}</span>
            <LogOut className="size-4"/>
          </button>
        ) : (
          <Link to="/login" className="text-sm text-indigo-600">Login</Link>
        )}
      </div>
    </header>
  );
}