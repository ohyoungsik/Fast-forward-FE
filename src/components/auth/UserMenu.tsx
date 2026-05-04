import { useState } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const displayName = user?.name || user?.username || '사용자';
  const initial = displayName.charAt(0).toUpperCase();

  async function handleLogout() {
    setOpen(false);
    await logout();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-900/40 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initial}
        </div>
        <span className="hidden sm:block max-w-[120px] truncate">{displayName}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-60 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800">
              <p className="text-sm font-semibold text-white truncate">{displayName}님</p>
              {user?.email && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
              )}
            </div>
            <div className="p-1.5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <LogOut size={14} />
                로그아웃
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
