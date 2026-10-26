import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle, signInAsMock } = useAuth();
  const navigate = useNavigate();

  async function handleGoogle() {
    await signInWithGoogle();
    navigate('/');
  }

  function mock(role: 'employee' | 'owner' | 'admin') {
    signInAsMock(role);
    navigate('/');
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-lg border p-6 bg-white dark:bg-gray-900">
        <h1 className="text-xl font-semibold mb-2">Welcome</h1>
        <p className="text-sm text-gray-500 mb-4">Sign in to Prosper SkatteFUNN Companion</p>
        <button onClick={handleGoogle} className="w-full rounded bg-indigo-600 text-white px-3 py-2">Sign in with Google</button>
        <div className="text-xs text-gray-500 my-3 text-center">or use mock login</div>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => mock('employee')} className="rounded border px-3 py-2 text-sm">Employee</button>
          <button onClick={() => mock('owner')} className="rounded border px-3 py-2 text-sm">Owner</button>
          <button onClick={() => mock('admin')} className="rounded border px-3 py-2 text-sm">Admin</button>
        </div>
      </div>
    </div>
  );
}